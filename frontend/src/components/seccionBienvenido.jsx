const WelcomeSection = ({ userName }) => {

  return (
    <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-6 mb-8 shadow-sm">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenido, {userName} 👋
        </h1>
        <p className="text-gray-600">
          Descubre y comparte conocimiento académico con tu comunidad universitaria
        </p>
      </div>
    </div>
  );
};

export default WelcomeSection;