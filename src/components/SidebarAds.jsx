import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * AdSense 广告单元组件
 */
const AdSenseUnit = ({ slot, onBlocked }) => {
  useEffect(() => {
    // 检测脚本是否被加载
    if (!window.adsbygoogle) {
      const timer = setTimeout(() => {
        if (!window.adsbygoogle) {
          onBlocked?.();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
      // 如果错误信息包含被屏蔽特征，触发回调
      if (e.message?.includes('blocked') || e.name === 'TagError') {
        onBlocked?.();
      }
    }
  }, [onBlocked]);

  return (
    <ins className="adsbygoogle"
         style={{ display: 'block', width: '100%', height: '100%' }}
         data-ad-client="ca-pub-8108389486087485"
         data-ad-slot={slot}
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  );
};

/**
 * 侧边广告浮窗组件
 */
const SidebarAds = () => {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);

  // 如果检测到广告被拦截，直接不渲染整个组件
  if (isBlocked) return null;

  return (
    <>
      {/* 左侧广告浮窗 */}
      {showLeft && (
        <div className="hidden 2xl:flex fixed left-4 top-1/2 -translate-y-1/2 w-40 h-[600px] z-40 group/ad">
          <button 
            onClick={() => setShowLeft(false)}
            className="absolute -top-3 -right-3 w-8 h-8 bg-card border-2 border-border rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500 shadow-lg transition-all opacity-0 group-hover/ad:opacity-100 z-50"
            title="关闭广告"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="w-full h-full bg-slate-100/50 dark:bg-slate-800/30 border border-border rounded-2xl overflow-hidden shadow-sm relative">
            <AdSenseUnit slot="6541825133" onBlocked={() => setIsBlocked(true)} />
          </div>
        </div>
      )}

      {/* 右侧广告浮窗 */}
      {showRight && (
        <div className="hidden 2xl:flex fixed right-4 top-1/2 -translate-y-1/2 w-40 h-[600px] z-40 group/ad">
          <button 
            onClick={() => setShowRight(false)}
            className="absolute -top-3 -left-3 w-8 h-8 bg-card border-2 border-border rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500 shadow-lg transition-all opacity-0 group-hover/ad:opacity-100 z-50"
            title="关闭广告"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="w-full h-full bg-slate-100/50 dark:bg-slate-800/30 border border-border rounded-2xl overflow-hidden shadow-sm relative">
            <AdSenseUnit slot="6541825133" onBlocked={() => setIsBlocked(true)} />
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarAds;
