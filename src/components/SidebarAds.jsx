import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * 侧边广告浮窗组件 (AdSense 占位符)
 */
const SidebarAds = () => {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  return (
    <>
      {/* 左侧广告浮窗 - 仅在超宽屏显示，避免遮挡内容 */}
      {showLeft && (
        <div className="hidden 2xl:flex fixed left-4 top-1/2 -translate-y-1/2 w-40 h-[600px] z-40 group/ad">
          <button 
            onClick={() => setShowLeft(false)}
            className="absolute -top-3 -right-3 w-8 h-8 bg-card border-2 border-border rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500 shadow-lg transition-all opacity-0 group-hover/ad:opacity-100 z-50"
            title="关闭广告"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="w-full h-full bg-slate-100 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-4 text-center group hover:border-primary/50 transition-colors shadow-sm relative overflow-hidden">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">AdSense</div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Skyscraper Ad
              <br />
              (160 x 600)
            </div>
            <div className="mt-4 w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-primary transition-all shadow-sm">
              $
            </div>
          </div>
        </div>
      )}

      {/* 右侧广告浮窗 -仅在超宽屏显示，避免遮挡内容 */}
      {showRight && (
        <div className="hidden 2xl:flex fixed right-4 top-1/2 -translate-y-1/2 w-40 h-[600px] z-40 group/ad">
          <button 
            onClick={() => setShowRight(false)}
            className="absolute -top-3 -left-3 w-8 h-8 bg-card border-2 border-border rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500 shadow-lg transition-all opacity-0 group-hover/ad:opacity-100 z-50"
            title="关闭广告"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="w-full h-full bg-slate-100 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-4 text-center group hover:border-primary/50 transition-colors shadow-sm relative overflow-hidden">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">AdSense</div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Skyscraper Ad
              <br />
              (160 x 600)
            </div>
            <div className="mt-4 w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-primary transition-all shadow-sm">
              $
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarAds;
