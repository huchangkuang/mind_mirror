"use client";

import Link from "next/link";
import { Building2, ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";

export default function CityMatchLandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700" />

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-float" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">
              发现理想之城
            </span>
          </div>

          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-fade-in-up">
            <Building2 className="w-10 h-10 text-white" />
          </div>

          {/* Main Title */}
          <h1 className="font-outfit text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight animate-fade-in-up">
            性格匹配城市测试
          </h1>

          {/* Subtitle */}
          <p className="font-worksans text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up">
            通过分析你的性格特征和生活方式偏好，为你推荐最适合居住的城市
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in-up">
            <Link
              href="/city-match/test"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-teal-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              开始测试
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              测试特色
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              基于心理学和城市研究，为你找到理想的居住之地
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, title: "多维度分析", desc: "从生活方式、社交、环境、节奏四个维度评估" },
              { icon: MapPin, title: "全球城市", desc: "涵盖国内外10+个特色城市，多元选择" },
              { icon: Clock, title: "5分钟完成", desc: "12道精心设计的题目，快速获得结果" },
              { icon: Sparkles, title: "智能匹配", desc: "基于算法推荐最匹配你性格的城市" },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-outfit text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              测试流程
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "回答问题", desc: "根据你的真实想法选择，无需刻意思考" },
              { step: "02", title: "分析计算", desc: "系统根据你的答案计算性格维度得分" },
              { step: "03", title: "获得推荐", desc: "查看匹配度最高的城市和详细分析" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-outfit text-xl font-bold shadow-lg">
                  {item.step}
                </div>
                <h3 className="font-outfit text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {item.desc}
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
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600" />

            {/* Content */}
            <div className="relative z-10 py-16 px-8 sm:px-12 text-center">
              <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-white mb-4">
                准备好发现你的理想城市了吗？
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                5分钟，开启一段寻找理想之城的旅程
              </p>

              <Link
                href="/city-match/test"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-teal-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                立即开始测试
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/70 text-sm">
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  返回首页
                </Link>
                <span className="hidden sm:inline">|</span>
                <span>免费 · 无需注册 · 即时结果</span>
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
