"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Brain,
  Building2,
  ArrowRight,
  Sparkles,
  Clock,
  Heart,
  Loader2,
} from "lucide-react";
import { AuthStatusPanel } from "@/components/auth/AuthStatusPanel";

// Icon mapping from string name to component
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Building2,
};

interface Test {
  id: number;
  test_id: string;
  title: string;
  description: string;
  icon_name: string;
  duration: string;
  featured: boolean;
  href: string;
  color_from: string;
  color_to: string;
}

export default function Home() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTests() {
      try {
        const response = await fetch("/api/tests");
        if (!response.ok) {
          throw new Error("Failed to fetch tests");
        }
        const data = await response.json();
        setTests(data.tests || []);
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError("无法加载测试数据，请稍后重试");
      } finally {
        setLoading(false);
      }
    }

    fetchTests();
  }, []);

  // Get icon component by name
  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Brain;
  };

  // Build gradient color string
  const getColor = (from: string, to: string) => {
    return `${from} ${to}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">加载中...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重新加载
          </button>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 gradient-hero" />

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float" />
        </div>

        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-20">
          <AuthStatusPanel />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">
              发现真实的自己
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-outfit text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-fade-in-up">
            Mind Mirror
          </h1>

          {/* Subtitle */}
          <p className="font-worksans text-xl sm:text-2xl text-white/90 mb-4 animate-fade-in-up">
            心理测试探索平台
          </p>
          <p className="font-worksans text-base sm:text-lg text-white/70 max-w-2xl mx-auto animate-fade-in-up">
            通过科学有趣的心理测试，深入了解自己，发现生活的无限可能
          </p>
        </div>
      </section>

      {/* Tests Grid Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              选择你的探索之旅
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              每个测试都是一次自我发现的旅程，选择一个开始探索吧
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {tests.map((test) => {
              const IconComponent = getIcon(test.icon_name);
              const colorGradient = getColor(test.color_from, test.color_to);

              return (
                <Link
                  key={test.test_id}
                  href={test.href}
                  className="group relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Gradient Border on Hover */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${colorGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm`} />
                  <div className="absolute inset-[2px] rounded-3xl bg-white dark:bg-slate-800 -z-10" />

                  {/* Featured Badge */}
                  {test.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium">
                        <Sparkles className="w-3 h-3" />
                        推荐
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorGradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-outfit text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {test.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {test.description}
                  </p>

                  {/* Meta & CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {test.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        免费
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all">
                      开始测试
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              为什么选择 Mind Mirror
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              精心设计的测试体验，让自我探索之旅更加轻松愉快
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: "科学可靠", desc: "基于经典心理学理论，经过验证的测评体系" },
              { icon: Clock, title: "简洁高效", desc: "5分钟即可完成，快速获得专业分析结果" },
              { icon: Heart, title: "完全免费", desc: "无需注册，无隐藏费用，随时随地开始测试" },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-outfit text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 gradient-cta" />

            {/* Content */}
            <div className="relative z-10 py-16 px-8 sm:px-12 text-center">
              <h2 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                准备好探索自己了吗？
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                选择一个测试开始，开启自我认知的新篇章
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/mbti"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  开始 MBTI 测试
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/city-match"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white/20 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-white/30"
                >
                  探索理想城市
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-outfit font-bold text-slate-900 dark:text-white text-xl">
            Mind Mirror
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © 2025 Mind Mirror. 探索真实的自己。
          </p>
        </div>
      </footer>
    </main>
  );
}
