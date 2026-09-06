import React from "react";
import { Truck, MapPin } from "lucide-react";

export const MapLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 sm:gap-6 px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
      {/* Origin */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-3.5 w-3.5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white dark:border-slate-900"></span>
        </span>
        <span className="font-semibold text-slate-900 dark:text-slate-100">Origin</span>
      </div>

      {/* Delivery point */}
      <div className="flex items-center gap-1.5">
        <MapPin className="w-4 h-4 text-red-500 fill-red-500/20" />
        <span>Delivery point</span>
        <div className="flex items-center gap-1 ml-0.5">
          <span className="w-2 h-2 rounded-full bg-red-500" title="D1"></span>
          <span className="w-2 h-2 rounded-full bg-amber-500" title="D2"></span>
          <span className="w-2 h-2 rounded-full bg-slate-500" title="D3"></span>
        </div>
      </div>

      {/* Live Truck */}
      <div className="flex items-center gap-2">
        <div className="p-1 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
          <Truck className="w-3.5 h-3.5" />
        </div>
        <span>Truck (live position)</span>
      </div>
    </div>
  );
};
