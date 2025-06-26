import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Startfreetrialbutton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/upload")}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
    >
      <Upload className="w-5 h-5 inline mr-2" />
      Start Free Trial
    </button>
  );
};

export default Startfreetrialbutton;
