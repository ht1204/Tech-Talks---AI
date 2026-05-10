import type { ToolHandler } from '../types/index.js';

export type WeatherMode = 'mock' | 'live';

const MOCK_WEATHER_DATA: Record<string, { temp: number; condition: string; humidity: number; windSpeed: number }> = {
  madrid: { temp: 22, condition: 'Sunny', humidity: 35, windSpeed: 12 },
  tokyo: { temp: 18, condition: 'Cloudy', humidity: 65, windSpeed: 8 },
  'new york': { temp: 15, condition: 'Rainy', humidity: 78, windSpeed: 20 },
  london: { temp: 12, condition: 'Foggy', humidity: 85, windSpeed: 15 },
  paris: { temp: 17, condition: 'Partly Cloudy', humidity: 55, windSpeed: 10 },
  sydney: { temp: 25, condition: 'Clear', humidity: 40, windSpeed: 18 },
  'bogota': { temp: 14, condition: 'Cloudy', humidity: 70, windSpeed: 9 },
  'mexico city': { temp: 20, condition: 'Sunny', humidity: 45, windSpeed: 7 },
  'buenos aires': { temp: 19, condition: 'Windy', humidity: 50, windSpeed: 25 },
  'sao paulo': { temp: 28, condition: 'Thunderstorm', humidity: 80, windSpeed: 22 },
};

const WEATHER_CODE_MAP: Record<string, string> = {
  '200': 'Thunderstorm', '201': 'Thunderstorm', '202': 'Thunderstorm',
  '230': 'Thunderstorm', '231': 'Thunderstorm', '232': 'Thunderstorm',
  '300': 'Drizzle', '301': 'Drizzle', '302': 'Drizzle',
  '310': 'Drizzle', '311': 'Drizzle', '312': 'Drizzle',
  '500': 'Rainy', '501': 'Rainy', '502': 'Rainy',
  '511': 'Freezing Rain', '520': 'Rainy', '521': 'Rainy',
  '600': 'Snowy', '601': 'Snowy', '602': 'Snowy',
  '611': 'Sleet', '612': 'Sleet', '615': 'Snowy', '616': 'Snowy',
  '620': 'Snowy', '621': 'Snowy', '622': 'Snowy',
  '701': 'Misty', '711': 'Smoky', '721': 'Hazy', '731': 'Dusty',
  '741': 'Foggy', '751': 'Sandy', '761': 'Dusty', '762': 'Volcanic Ash',
  '771': 'Windy', '781': 'Tornado',
  '800': 'Clear', '801': 'Partly Cloudy', '802': 'Scattered Clouds',
  '803': 'Cloudy', '804': 'Overcast',
};

async function executeMock(args: Record<string, unknown>): Promise<Record<string, unknown>> {
  const city = (args.city as string).toLowerCase().trim();
  const unit = (args.unit as string) || 'celsius';
  const weather = MOCK_WEATHER_DATA[city];

  if (!weather) {
    const randomWeather = {
      temp: Math.floor(Math.random() * 30) + 5,
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Windy', 'Clear'][Math.floor(Math.random() * 5)],
      humidity: Math.floor(Math.random() * 50) + 30,
      windSpeed: Math.floor(Math.random() * 25) + 5,
    };

    const temp = unit === 'fahrenheit' ? Math.round(randomWeather.temp * 9 / 5 + 32) : randomWeather.temp;

    return {
      city: args.city,
      temperature: temp,
      unit: unit === 'fahrenheit' ? '°F' : '°C',
      condition: randomWeather.condition,
      humidity: `${randomWeather.humidity}%`,
      windSpeed: `${randomWeather.windSpeed} km/h`,
      dataSource: 'mock',
      note: 'Simulated data (city not in mock database, using random values)',
    };
  }

  const temp = unit === 'fahrenheit' ? Math.round(weather.temp * 9 / 5 + 32) : weather.temp;

  return {
    city: args.city,
    temperature: temp,
    unit: unit === 'fahrenheit' ? '°F' : '°C',
    condition: weather.condition,
    humidity: `${weather.humidity}%`,
    windSpeed: `${weather.windSpeed} km/h`,
    dataSource: 'mock',
  };
}

async function executeLive(args: Record<string, unknown>): Promise<Record<string, unknown>> {
  const city = args.city as string;
  const unit = (args.unit as string) || 'celsius';
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return {
      error: 'OPENWEATHER_API_KEY not configured',
      message: 'Set OPENWEATHER_API_KEY in your .env file to use live weather data. Get a free key at https://home.openweathermap.org/',
    };
  }

  const metricParam = unit === 'fahrenheit' ? 'imperial' : 'metric';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${metricParam}`;

  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    return {
      error: `OpenWeatherMap API error: ${response.status}`,
      city,
      details: (body as Record<string, unknown>).message || response.statusText,
    };
  }

  const data = await response.json() as Record<string, unknown>;
  const main = data.main as Record<string, number>;
  const wind = data.wind as Record<string, number>;
  const weatherArr = data.weather as Array<{ id: number; description: string }>;
  const weatherId = String(weatherArr?.[0]?.id || '800');
  const condition = WEATHER_CODE_MAP[weatherId] || weatherArr?.[0]?.description || 'Unknown';

  return {
    city: data.name || city,
    country: (data.sys as Record<string, unknown>)?.country || '',
    temperature: Math.round(main.temp),
    unit: unit === 'fahrenheit' ? '°F' : '°C',
    feelsLike: Math.round(main.feels_like),
    condition,
    description: weatherArr?.[0]?.description || '',
    humidity: `${main.humidity}%`,
    windSpeed: `${Math.round((wind.speed || 0) * 3.6)} km/h`,
    pressure: `${main.pressure} hPa`,
    dataSource: 'openweathermap',
    rawApiUrl: url.replace(apiKey, '***'),
  };
}

export const weatherTool: ToolHandler = {
  definition: {
    name: 'get_weather',
    description: 'Get the current weather for a specified city. Returns temperature, condition, humidity and wind speed.',
    parameters: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: 'The city name to get weather for, e.g. "Madrid", "Tokyo", "New York"',
        },
        unit: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          description: 'Temperature unit. Defaults to celsius.',
        },
      },
      required: ['city'],
    },
  },

  execute: async (args, options) => {
    const mode = (options?.weatherMode as WeatherMode) || 'mock';
    if (mode === 'live') {
      return executeLive(args);
    }
    return executeMock(args);
  },
};
