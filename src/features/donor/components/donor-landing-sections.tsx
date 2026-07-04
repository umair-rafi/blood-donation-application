"use client";

import { useState } from "react";
import Image from "next/image";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Shield,
  Users,
  CheckCircle,
  FileCheck,
  Clock,
  MapPin,
  Phone,
  Star,
  Droplet,
  Navigation,
  ArrowRight,
  Building2,
} from "lucide-react";

interface Hospital {
  name: string;
  image: string;
  address: string;
  phone: string;
  hours: string;
  rating: number;
  reviews: number;
  bloodTypesNeeded: string[];
  description: string;
  totalDonations: number;
}

export const DonorLandingSections = () => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const hospitals: Hospital[] = [
    {
      name: "Nishtar Hospital",
      image: "/nishtar-hospital.jpg",
      address: "Nishtar Road, Multan, Punjab",
      phone: "+92 61 9201200",
      hours: "24/7 Emergency & Donation Center",
      rating: 4.6,
      reviews: 328,
      bloodTypesNeeded: ["O-", "AB+", "B-"],
      description:
        "One of the largest teaching hospitals in South Punjab, offering a dedicated blood bank with round-the-clock donation and transfusion services.",
      totalDonations: 4210,
    },
    {
      name: "City Hospital",
      image: "/city-hospital.jpg",
      address: "Circular Road, Multan, Punjab",
      phone: "+92 61 4571234",
      hours: "8:00 AM - 10:00 PM Daily",
      rating: 4.3,
      reviews: 214,
      bloodTypesNeeded: ["O+", "A-"],
      description:
        "A trusted private healthcare facility partnering closely with our platform to fast-track verified donor matching for urgent cases.",
      totalDonations: 1890,
    },
    {
      name: "Mukhtar A. Sheikh Hospital",
      image: "/mukhtar-a-sheikh-hospital.jpg",
      address: "Shershah Road, Multan, Punjab",
      phone: "+92 61 6510300",
      hours: "24/7 Emergency & Donation Center",
      rating: 4.7,
      reviews: 401,
      bloodTypesNeeded: ["AB-", "B+", "O-"],
      description:
        "A leading multispecialty hospital with an advanced blood bank facility, known for strict medical screening and donor care.",
      totalDonations: 3560,
    },
    {
      name: "Shabaz Sharif Hospital",
      image: "/shabaz-sharif-hospital.jpg",
      address: "Vehari Road, Multan, Punjab",
      phone: "+92 61 4783300",
      hours: "9:00 AM - 9:00 PM Daily",
      rating: 4.4,
      reviews: 176,
      bloodTypesNeeded: ["A+", "O+"],
      description:
        "A community-focused hospital serving thousands of patients annually, with growing demand for verified donor partnerships.",
      totalDonations: 1245,
    },
  ];

  const verificationSteps = [
    {
      icon: FileCheck,
      title: "Blood Report Upload",
      description: "Donors upload their medical blood reports for verification",
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      icon: Shield,
      title: "Medical Verification",
      description:
        "Our team verifies authenticity and accuracy of submitted reports",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: CheckCircle,
      title: "Approval & Matching",
      description:
        "Verified donors are matched with recipients based on blood type",
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description:
        "Get instant notifications when you're matched with a recipient",
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ];

  const openHospitalDetails = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50">
      {/* Section 1: How Our Application Helps */}
      <section className="py-20 px-4 md:px-8 lg:px-16 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-red-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 -right-24 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-red-600 text-white px-4 py-2 shadow-md shadow-red-200">
              Save Lives Together
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-700 via-red-600 to-rose-600 bg-clip-text text-transparent leading-tight">
              Transform Lives Through Blood Donation
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Join our mission to connect verified blood donors with those in
              critical need. Every donation saves lives, and we make the process
              safe, verified, and seamless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-transparent hover:border-red-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white/80 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-red-200">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">
                  Easy Donation Process
                </CardTitle>
                <CardDescription className="text-base">
                  Streamlined process from registration to donation, making it
                  simple to save lives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Quick profile setup with essential information
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Real-time matching with recipients in need
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Instant notifications and updates
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-transparent hover:border-blue-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white/80 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Verified & Safe</CardTitle>
                <CardDescription className="text-base">
                  Every donor is medically verified to ensure safety for both
                  donors and recipients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Medical report verification by professionals
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Blood type accuracy confirmation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Health screening and eligibility checks
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-transparent hover:border-purple-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white/80 backdrop-blur">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-200">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Community Impact</CardTitle>
                <CardDescription className="text-base">
                  Be part of a growing community of heroes saving lives across
                  Multan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Connect with recipients directly
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Track your donation impact and history
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Join a network of verified donors
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 2: Partner Hospitals in Multan */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-600 text-white px-4 py-2 shadow-md shadow-blue-200">
              Trusted Partners
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
              Partner Hospitals in Multan
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We collaborate with leading hospitals across Multan to ensure
              seamless blood donation and transfusion services. Click any
              hospital to see full details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hospitals.map((hospital, index) => (
              <Card
                key={index}
                onClick={() => openHospitalDetails(hospital)}
                className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 hover:border-red-200 cursor-pointer hover:-translate-y-1"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={hospital.image}
                    alt={hospital.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold text-gray-800">
                      View details
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-800" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-red-400" />
                      <Badge className="bg-red-500 text-white">
                        Partner Hospital
                      </Badge>
                      <div className="flex items-center gap-1 ml-auto">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-white font-medium">
                          {hospital.rating}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {hospital.name}
                    </h3>
                    <p className="text-gray-200 mt-1">Multan, Punjab</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-600">Verified</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-gray-600">
                          Active Partner
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-red-600 group-hover:underline">
                      See more →
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Verification Process */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-600 text-white px-4 py-2 shadow-md shadow-green-200">
              Security First
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
              How We Verify Donors
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our rigorous verification process ensures every donor is medically
              cleared and safe to donate, protecting both donors and recipients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {verificationSteps.map((step, index) => (
              <Card
                key={index}
                className="border-2 hover:border-red-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group"
              >
                <div
                  className={`absolute top-0 right-0 w-20 h-20 ${step.bg} rounded-bl-full opacity-70`}
                />
                <CardHeader>
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <step.icon className={`w-7 h-7 ${step.color}`} />
                  </div>
                  <div className="text-sm font-bold text-gray-400 mb-2">
                    STEP {index + 1}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-600" />
                Why Verification Matters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Safety Guaranteed
                  </h4>
                  <p className="text-gray-600">
                    Medical verification ensures all donors are healthy and
                    eligible to donate, preventing health risks for both
                    parties.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Accurate Matching
                  </h4>
                  <p className="text-gray-600">
                    Verified blood type information ensures recipients get
                    exactly what they need without compatibility issues.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Trust & Transparency
                  </h4>
                  <p className="text-gray-600">
                    Our verification builds trust in the community, encouraging
                    more people to participate in saving lives.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <div className="text-center mt-12">
            <p className="text-gray-600 mb-6 text-lg">
              Ready to become a verified donor and start saving lives?
            </p>
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-12 shadow-lg shadow-red-200"
            >
              Start Verification Process
            </Button>
          </div> */}
        </div>
      </section>

      {/* Hospital Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          {selectedHospital && (
            <>
              <div className="relative h-56 w-full">
                <Image
                  src={selectedHospital.image}
                  alt={selectedHospital.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <Badge className="bg-red-500 text-white mb-2">
                    Partner Hospital
                  </Badge>
                  <DialogHeader className="p-0 text-left">
                    <DialogTitle className="text-2xl md:text-3xl font-bold text-white">
                      {selectedHospital.name}
                    </DialogTitle>
                  </DialogHeader>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Rating & quick stats */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-800">
                      {selectedHospital.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({selectedHospital.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-full">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {selectedHospital.totalDonations.toLocaleString()}{" "}
                      donations facilitated
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed">
                  {selectedHospital.description}
                </p>

                <Separator />

                {/* Contact details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Address
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedHospital.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Phone</p>
                      <p className="text-sm text-gray-500">
                        {selectedHospital.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Hours</p>
                      <p className="text-sm text-gray-500">
                        {selectedHospital.hours}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Type</p>
                      <p className="text-sm text-gray-500">
                        Verified Partner Facility
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Blood types needed */}
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-red-600" />
                    Currently needed blood types
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.bloodTypesNeeded.map((type) => (
                      <Badge
                        key={type}
                        className="bg-red-600 text-white text-sm px-3 py-1"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
