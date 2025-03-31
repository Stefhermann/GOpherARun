"use client";

import EventForm from "@/components/Events/event-form"; // Import the separated form

export default function EventPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Information Section */}
          <div className="space-y-6 text-gray-800">
            <h2 className="text-3xl text-[#7A0019] font-bold">Why Create an Event?</h2>
            <p>
              Organizing an event helps bring people together for shared activities. Whether it&apos;s a morning run, a marathon, or a casual jog, hosting an event can be a great way to stay active and meet like-minded individuals.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="text-blue-600 text-2xl">🏃‍♂️</div>
                <div>
                  <h3 className="text-lg text-[#7A0019] font-semibold">Meet More Running Buddies</h3>
                  <p className="text-gray-600">
                    Connect with runners near you and build a strong fitness community.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-blue-600 text-2xl">📅</div>
                <div>
                  <h3 className="text-lg text-[#7A0019] font-semibold">Stay Consistent</h3>
                  <p className="text-gray-600">
                    Scheduling an event keeps you accountable and motivated to run regularly.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-blue-600 text-2xl">💪</div>
                <div>
                  <h3 className="text-lg text-[#7A0019] font-semibold">Achieve Your Goals</h3>
                  <p className="text-gray-600">
                    Whether it&apos;s weight loss, endurance training, or just staying active, setting up events helps you stay on track.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column: Event Form */}
          <EventForm />
        </div>
      </div>
    </div>
  );
}

