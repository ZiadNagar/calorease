import { redirect } from "next/navigation";
import Image from "next/image";
import { getProfile } from "@/actions";
import { ProfileForm } from "@/features/onboarding";

const HomePage = async () => {
  const profile = await getProfile();

  if (profile) {
    redirect("/profile");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 sm:w-125 h-50 sm:h-100 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative">
          {/* Logo */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary to-accent opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="CalorEase"
                    width={32}
                    height={32}
                    className="rounded-lg w-6 h-6 sm:w-8 sm:h-8"
                  />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight">
                Calor<span className="text-gradient-nature">Ease</span>
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-7xl mx-auto mb-6 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-3 sm:mb-4">
              Fuel Your Body
              <span className="block text-gradient-nature">With Precision</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto px-2">
              Clinical-grade metabolic analysis. Personalized nutrition.{" "}
              <span className="text-foreground font-medium">
                Built for results.
              </span>
            </p>
          </div>

          {/* Profile Form */}
          <div className="max-w-xl mx-auto w-full">
            <ProfileForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto pt-8 sm:pt-12 pb-4 sm:pb-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
              Science-Backed Methodology
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Metabolic Profiling",
                description:
                  "Mifflin-St Jeor and Katch-McArdle equations calculate your precise energy requirements.",
                gradient: "from-primary to-accent",
              },
              {
                step: "02",
                title: "Macro Distribution",
                description:
                  "Goal-specific protein, carbohydrate, and fat ratios optimized for your objectives.",
                gradient: "from-accent to-chart-3",
              },
              {
                step: "03",
                title: "Exchange Planning",
                description:
                  "Clinical food exchange system provides flexibility while maintaining nutritional targets.",
                gradient: "from-chart-3 to-primary",
              },
            ].map((feature) => (
              <div
                key={feature.step}
                className="group p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white bg-linear-to-br ${feature.gradient} mb-4`}
                >
                  {feature.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
