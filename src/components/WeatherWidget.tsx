"use client";

import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, Loader2 } from "lucide-react";

export function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const apiKey = "6ec5dca327fdba58e4fdc3358f037b3c";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=Salinas%20da%20Margarida,br&units=metric&lang=pt_br&appid=${apiKey}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setWeather(data);
        }
      } catch (error) {
        console.error("Erro ao buscar clima:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-brand-text/80 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Carregando...
      </div>
    );
  }

  if (!weather) return null;

  // Escolher ícone baseado no clima
  let WeatherIcon = Cloud;
  const main = weather.weather[0]?.main?.toLowerCase() || '';
  if (main.includes('clear')) WeatherIcon = Sun;
  if (main.includes('rain') || main.includes('drizzle')) WeatherIcon = CloudRain;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/10 backdrop-blur-sm rounded-full text-brand-text">
      <WeatherIcon className="w-4 h-4 text-amber-200" />
      <span className="text-sm font-bold">{Math.round(weather.main.temp)}°C</span>
      <span className="text-xs opacity-80 capitalize hidden md:inline-block border-l border-brand-text/20 pl-2 ml-1">
        {weather.weather[0]?.description}
      </span>
    </div>
  );
}
