import React from 'react';

const SignupFrom = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-white">Create Account</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-gray-200 font-medium mb-2">Name</label>
            <input type="text" placeholder="Enter your name" className="w-full px-4 py-2 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur" />
          </div>

          <div>
            <label className="block text-gray-200 font-medium mb-2">Email</label>
            <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur" />
          </div>
          
          <div>
            <label className="block text-gray-200 font-medium mb-2">Password</label>
            <input type="password" placeholder="Create a password" className="w-full px-4 py-2 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur" />
          </div>
          
          <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:scale-105 hover:shadow-lg transition transform">Sign Up</button>
        </form>

        <p className="text-center text-sm text-gray-300">
          Already have an account? <a href="/sign-in" className="text-blue-400 hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default SignupFrom;
