"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Search,
  Bell,
  Shield,
  CheckCircle,
  Clock,
  Users,
  Activity,
  Zap,
  Phone,
} from "lucide-react";
import { LocationControl } from "./location-control";
import Link from "next/link";

export const RecipientLandingSection = () => {
  const features = [
    {
      icon: Search,
      title: "Find Donors Instantly",
      description:
        "Search and connect with verified blood donors in your area based on blood type compatibility",
      color: "bg-red-500",
      highlights: [
        "Advanced blood type matching",
        "Location-based donor search",
        "Real-time availability status",
      ],
    },
    {
      icon: Bell,
      title: "Emergency Alerts",
      description:
        "Send urgent blood requests to all matching donors in your vicinity when time is critical",
      color: "bg-orange-500",
      highlights: [
        "Instant notification to donors",
        "Priority emergency matching",
        "24/7 urgent request support",
      ],
    },
    {
      icon: Shield,
      title: "Verified & Safe",
      description:
        "All donors are medically verified with authenticated blood reports ensuring safety and reliability",
      color: "bg-blue-500",
      highlights: [
        "Medical report verification",
        "Background screening process",
        "Health eligibility confirmation",
      ],
    },
  ];

  const steps = [
    {
      number: "01",
      icon: Users,
      title: "Create Your Profile",
      description:
        "Sign up and complete your recipient profile with medical information and blood type requirements",
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      number: "02",
      icon: Search,
      title: "Search for Donors",
      description:
        "Browse verified donors matching your blood type and location preferences with detailed profiles",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      number: "03",
      icon: Phone,
      title: "Connect Directly",
      description:
        "Reach out to donors through our platform with contact information and coordinate donation",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      number: "04",
      icon: Activity,
      title: "Track & Update",
      description:
        "Monitor your requests, track responses, and keep your profile updated for better matching",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Fast Response Time",
      description: "Get connected with donors within minutes of your request",
      stat: "<5 min",
    },
    {
      icon: Users,
      title: "Wide Network",
      description: "Access to thousands of verified donors across Multan",
      stat: "1000+",
    },
    {
      icon: Shield,
      title: "100% Verified",
      description: "Every donor undergoes thorough medical verification",
      stat: "100%",
    },
    {
      icon: Clock,
      title: "Available 24/7",
      description: "Round-the-clock access to find blood donors anytime",
      stat: "24/7",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Location Control Section */}
      <section className="py-8 px-4 md:px-8 lg:px-16">
        <div className="max-w-2xl mx-auto">
          <LocationControl />
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-red-600 text-white px-6 py-2 text-sm font-semibold">
              Find Blood Donors Quickly & Safely
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-red-700 leading-tight">
              Your Life-Saving
              <br />
              Blood Donor Connection
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              When every second counts, find verified blood donors instantly.
              Connect with compassionate donors in your area who are ready to
              help save lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href={"/recipient/dashboard"} prefetch={true}>
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Find Donors Now
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-red-500 text-red-500 hover:bg-red-50 px-8 py-6 text-lg font-semibold"
              >
                <Bell className="w-5 h-5 mr-2" />
                Send Emergency Alert
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="border-2 hover:border-red-300 transition-all hover:shadow-lg"
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {benefit.stat}
                  </div>
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    {benefit.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {benefit.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-red-600 text-white px-4 py-2">
              Powerful Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
              Everything You Need to Find Donors
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive tools to help you find and
              connect with the right blood donors quickly and safely
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-red-300 transition-all hover:shadow-xl group"
              >
                <CardHeader>
                  <div
                    className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-600 text-white px-4 py-2">
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
              How to Find Donors in 4 Easy Steps
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting connected with verified blood donors is quick and
              straightforward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="border-2 hover:border-red-300 transition-all hover:shadow-xl relative group"
              >
                <CardHeader>
                  <div
                    className={`absolute -top-4 -left-4 w-12 h-12 ${step.bgColor} rounded-full flex items-center justify-center border-4 border-white shadow-lg`}
                  >
                    <span className={`text-lg font-bold ${step.color}`}>
                      {step.number}
                    </span>
                  </div>
                  <div
                    className={`w-12 h-12 ${step.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <step.icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-red-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-red-600 text-white px-4 py-2">
                Why Recipients Trust Us
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
                Your Safety & Success Are Our Priority
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We understand that finding blood donors can be stressful and
                time-sensitive. That&apos;s why we&apos;ve built a platform that
                puts your needs first with verified donors, instant connections,
                and 24/7 availability.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Medically Verified Donors
                    </h3>
                    <p className="text-gray-600">
                      Every donor has been screened and verified with authentic
                      medical reports
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Privacy Protected
                    </h3>
                    <p className="text-gray-600">
                      Your personal information is secure and only shared when
                      you choose
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Lightning Fast
                    </h3>
                    <p className="text-gray-600">
                      Find and connect with donors in minutes, not hours or days
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="border-2 border-red-200 shadow-2xl">
                <CardHeader className="bg-red-600 text-white">
                  <CardTitle className="text-2xl">
                    Ready to Find a Donor?
                  </CardTitle>
                  <CardDescription className="text-red-50">
                    Join thousands of recipients who found life-saving donors
                    through our platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="font-medium text-gray-800">
                        Free to use - no hidden costs
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-blue-500" />
                      <span className="font-medium text-gray-800">
                        Verified donors only
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-purple-500" />
                      <span className="font-medium text-gray-800">
                        24/7 emergency support
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-orange-500" />
                      <span className="font-medium text-gray-800">
                        Instant donor matching
                      </span>
                    </div>
                    <Button
                      size="lg"
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Start Finding Donors Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-red-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Every Second Counts in Emergencies
          </h2>
          <p className="text-xl mb-8 text-red-50">
            Don&apos;t wait until it&apos;s too late. Connect with verified
            blood donors right now and be prepared for any emergency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={"/recipient/dashboard"} prefetch={true}>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-red-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl"
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Donors
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-black hover:bg-white/10 px-8 py-6 text-lg font-semibold"
            >
              <Bell className="w-5 h-5 mr-2" />
              Emergency Alert
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
