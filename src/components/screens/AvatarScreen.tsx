import React, { useState } from 'react';
import { useGlow } from '../../context/GlowContext';
import { Smile, Shirt, Scissors, Sparkles, Image, ArrowLeft, Check, Lock, ShoppingBag } from 'lucide-react';

export const AvatarScreen: React.FC = () => {
  const { user, avatarItems, buyAvatarItem, equipAvatarItem, navigate } = useGlow();
  const [activeTab, setActiveTab] = useState<'outfit' | 'hairStyle' | 'accessory' | 'background'>('outfit');

  if (!user) return null;

  const tabs = [
    { id: 'outfit', label: 'Ropa', icon: Shirt },
    { id: 'hairStyle', label: 'Peinados', icon: Scissors },
    { id: 'accessory', label: 'Accesorios', icon: Sparkles },
    { id: 'background', label: 'Fondos', icon: Image }
  ];

  const filteredItems = avatarItems.filter(i => i.type === activeTab);

  const getBgGradient = (bgId: string) => {
    switch (bgId) {
      case 'bg_sunset': return 'from-pink-400 via-purple-500 to-indigo-600';
      case 'bg_garden': return 'from-emerald-700 to-teal-950';
      default: return 'from-purple-900 to-indigo-950';
    }
  };

  const getAccessoryEmoji = (accId: string) => {
    switch (accId) {
      case 'acc_glasses': return '😎';
      case 'acc_crown': return '👑';
      case 'acc_headphones': return '🎧';
      default: return '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('home')}
          className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Inicio</span>
        </button>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-extrabold text-sm border border-amber-300">
          <span>💎 {user.coins} Monedas Glow</span>
        </div>
      </div>

      {/* Hero Avatar Stage */}
      <div className={`bg-gradient-to-br ${getBgGradient(user.avatarConfig.background)} rounded-[36px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[280px]`}>
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
          Probador y Tienda Glow
        </div>

        {/* Character Visualizer */}
        <div className="relative my-4 transform hover:scale-105 transition-transform duration-300">
          <div className="w-40 h-40 rounded-full border-4 border-white/60 bg-purple-800 shadow-2xl overflow-hidden relative flex flex-col items-center justify-center">
            <img 
              src={user.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
              alt="Avatar principal" 
              className="w-full h-full object-cover" 
            />
            {/* Accessory overlay */}
            {user.avatarConfig.accessory !== 'none' && (
              <div className="absolute inset-0 flex items-center justify-center text-5xl bg-black/20 backdrop-blur-xs font-bold animate-bounce">
                {getAccessoryEmoji(user.avatarConfig.accessory)}
              </div>
            )}
          </div>
          
          {/* Level badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-amber-400 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow">
            Estilo Nivel {user.level} ✨
          </div>
        </div>

        <h2 className="text-2xl font-black">{user.name}</h2>
        <p className="text-xs text-purple-200 mt-0.5">
          Tu apariencia refleja tu confianza y actitud positiva.
        </p>
      </div>

      {/* Shop / Wardrobe Tabs */}
      <div className="space-y-4">
        <div className="flex gap-2 border-b border-purple-100 dark:border-purple-900/40 pb-3 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-purple-100 dark:border-purple-900/40 hover:bg-purple-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {filteredItems.map((item) => {
            const isUnlocked = item.unlocked;
            const isEquipped = 
              (activeTab === 'outfit' && user.avatarConfig.outfit === item.id) ||
              (activeTab === 'hairStyle' && user.avatarConfig.hairStyle === item.id) ||
              (activeTab === 'accessory' && user.avatarConfig.accessory === item.id) ||
              (activeTab === 'background' && user.avatarConfig.background === item.id);

            const canBuy = user.coins >= item.price;
            const levelLocked = user.level < item.requiredLevel;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-3xl border flex flex-col justify-between transition-all ${
                  isEquipped
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 ring-2 ring-purple-500 shadow-md'
                    : isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-purple-100 dark:border-purple-900/30 hover:border-purple-300'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-80'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase text-purple-500">
                      Req. Nivel {item.requiredLevel}
                    </span>
                    {isEquipped ? (
                      <span className="text-[10px] font-extrabold text-emerald-500 flex items-center gap-0.5">
                        <Check className="w-3.5 h-3.5" /> Equipado
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-bold text-slate-400">En armario</span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                        <Lock className="w-3 h-3" /> Bloqueado
                      </span>
                    )}
                  </div>

                  <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 dark:bg-slate-800 flex items-center justify-center text-3xl my-2 shadow-inner">
                    {item.type === 'accessory' ? getAccessoryEmoji(item.id) || '✨' : '🛍️'}
                  </div>

                  <h4 className="font-extrabold text-sm text-center text-slate-800 dark:text-white truncate">
                    {item.name}
                  </h4>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {isEquipped ? (
                    <button
                      disabled
                      className="w-full py-2 rounded-xl bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-bold text-xs cursor-default"
                    >
                      En uso
                    </button>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => equipAvatarItem(item.type, item.id, item.color)}
                      className="w-full py-2 rounded-xl bg-purple-600 text-white font-extrabold text-xs hover:bg-purple-700 active:scale-95 transition-all shadow-sm"
                    >
                      Equipar
                    </button>
                  ) : levelLocked ? (
                    <button
                      disabled
                      className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold text-xs cursor-not-allowed"
                    >
                      Alcanza Nivel {item.requiredLevel}
                    </button>
                  ) : (
                    <button
                      onClick={() => buyAvatarItem(item)}
                      disabled={!canBuy}
                      className={`w-full py-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        canBuy
                          ? 'bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-md hover:opacity-95 active:scale-95'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{item.price} 💎</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
