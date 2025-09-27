import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const Navigation = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-retro-electric/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="font-orbitron text-2xl font-bold text-retro-electric animate-neon-pulse">
            RETRO ARCADE
          </div>
          <div className="flex gap-6">
            {['home', 'games', 'leaderboard', 'settings'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`font-orbitron text-sm uppercase tracking-wider transition-all duration-300 ${
                  activeSection === section
                    ? 'text-retro-orange border-b-2 border-retro-orange'
                    : 'text-retro-electric hover:text-retro-orange'
                }`}
              >
                {section === 'home' ? 'Главная' : 
                 section === 'games' ? 'Игры' :
                 section === 'leaderboard' ? 'Лидеры' : 'Настройки'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

  const HeroSection = () => (
    <section className="pt-24 pb-16 text-center">
      <div className="container mx-auto px-6">
        <h1 className="font-orbitron text-6xl md:text-8xl font-black text-transparent bg-gradient-to-r from-retro-electric via-retro-orange to-retro-pink bg-clip-text animate-neon-pulse mb-6">
          RETRO ARCADE
        </h1>
        <p className="text-xl text-retro-electric/80 mb-8 max-w-2xl mx-auto">
          Окунись в мир классических аркадных игр с современной графикой и неоновым стилем
        </p>
        <Button 
          size="lg" 
          className="font-orbitron text-lg bg-gradient-to-r from-retro-orange to-retro-pink hover:from-retro-pink hover:to-retro-orange animate-retro-glow transition-all duration-300"
        >
          <Icon name="Play" className="mr-2" />
          НАЧАТЬ ИГРУ
        </Button>
      </div>
    </section>
  );

  const GameCard = ({ title, description, icon, gameKey, difficulty }: {
    title: string;
    description: string;
    icon: string;
    gameKey: string;
    difficulty: string;
  }) => (
    <Card className="bg-black/60 border-2 border-retro-electric/30 hover:border-retro-orange transition-all duration-300 p-6 animate-float">
      <div className="text-center">
        <div className="text-4xl mb-4 text-retro-electric">
          <Icon name={icon as any} size={48} className="mx-auto" />
        </div>
        <h3 className="font-orbitron text-xl font-bold text-retro-orange mb-2">{title}</h3>
        <p className="text-retro-electric/70 mb-4 text-sm">{description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-retro-electric/60 font-orbitron">
            Сложность: {difficulty}
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon key={star} name="Star" size={12} className="text-retro-orange" />
            ))}
          </div>
        </div>
        <Button 
          className="w-full font-orbitron bg-retro-blue hover:bg-retro-electric text-white"
          onClick={() => window.open(`#game-${gameKey}`, '_self')}
        >
          ИГРАТЬ
        </Button>
      </div>
    </Card>
  );

  const GameSection = () => (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="font-orbitron text-4xl font-bold text-center text-retro-electric mb-12">
          ВЫБЕРИ ИГРУ
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <GameCard
            title="DOODLE JUMP"
            description="Прыгай по платформам и достигни максимальной высоты!"
            icon="ArrowUp"
            gameKey="doodle"
            difficulty="Легкая"
          />
          <GameCard
            title="SUPER MARIO JUMP"
            description="Классические прыжки с грибочками и монетками!"
            icon="Crown"
            gameKey="mario"
            difficulty="Средняя"
          />
          <GameCard
            title="GEOMETRY DASH"
            description="Ритмичные препятствия и геометрические формы!"
            icon="Zap"
            gameKey="geometry"
            difficulty="Сложная"
          />
        </div>
      </div>
    </section>
  );

  const LeaderboardSection = () => (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="font-orbitron text-4xl font-bold text-center text-retro-electric mb-12">
          ТАБЛИЦА ЛИДЕРОВ
        </h2>
        <div className="max-w-2xl mx-auto">
          {[
            { name: 'КОСМОНАВТ_2024', score: 15420, game: 'Doodle Jump' },
            { name: 'RETRO_MASTER', score: 12850, game: 'Geometry Dash' },
            { name: 'MARIO_FAN', score: 11200, game: 'Super Mario Jump' },
            { name: 'PIXEL_HERO', score: 9980, game: 'Doodle Jump' },
            { name: 'NEON_GAMER', score: 8750, game: 'Geometry Dash' }
          ].map((player, index) => (
            <Card key={index} className="mb-4 bg-black/60 border border-retro-electric/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="font-orbitron text-2xl font-bold text-retro-orange">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-orbitron text-retro-electric font-bold">
                      {player.name}
                    </div>
                    <div className="text-sm text-retro-electric/60">
                      {player.game}
                    </div>
                  </div>
                </div>
                <div className="font-orbitron text-xl font-bold text-retro-orange">
                  {player.score.toLocaleString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );

  const SettingsSection = () => (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="font-orbitron text-4xl font-bold text-center text-retro-electric mb-12">
          НАСТРОЙКИ
        </h2>
        <div className="max-w-md mx-auto">
          <Card className="bg-black/60 border border-retro-electric/30 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-orbitron text-retro-electric">Звук</span>
                <Button variant="outline" size="sm" className="border-retro-orange text-retro-orange">
                  ВКЛ
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-orbitron text-retro-electric">Музыка</span>
                <Button variant="outline" size="sm" className="border-retro-orange text-retro-orange">
                  ВКЛ
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-orbitron text-retro-electric">Вибрация</span>
                <Button variant="outline" size="sm" className="border-retro-electric text-retro-electric">
                  ВЫКЛ
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-orbitron text-retro-electric">Сложность</span>
                <Button variant="outline" size="sm" className="border-retro-orange text-retro-orange">
                  СРЕДНЯЯ
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
            <HeroSection />
            <GameSection />
          </>
        );
      case 'games':
        return <GameSection />;
      case 'leaderboard':
        return <LeaderboardSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <HeroSection />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      {renderContent()}
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-retro-electric rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-retro-orange rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-retro-pink rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-retro-neon rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default Index;