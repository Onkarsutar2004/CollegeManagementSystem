import { InfoCard } from "@/lib/types";

const QuickInfo = () => {
  const infoCards: InfoCard[] = [
    {
      icon: "fas fa-graduation-cap",
      title: "50+ Programs",
      description: "Choose from a wide range of undergraduate and graduate programs designed to prepare you for the future.",
    },
    {
      icon: "fas fa-users",
      title: "12:1 Student-Faculty Ratio",
      description: "Enjoy personalized attention and mentorship from our world-class faculty members.",
    },
    {
      icon: "fas fa-globe-americas",
      title: "Global Opportunities",
      description: "Study abroad programs and international partnerships in over 30 countries worldwide.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {infoCards.map((card, index) => (
            <div
              key={index}
              className="bg-primary-50 p-8 rounded-lg border border-primary-100 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300"
            >
              <i className={`${card.icon} text-4xl text-primary-600 mb-4`}></i>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickInfo;
