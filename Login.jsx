import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, GraduationCap, Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      
      // Navigate based on role
      const routes = {
        admin: '/admin',
        teacher: '/teacher',
        student: '/student'
      };
      navigate(routes[user.role] || '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950" />
        
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow delay-500" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow delay-300" />
        </div>
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold">EduPro</h1>
                <p className="text-primary-400 font-medium">School Management System</p>
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-display font-bold mb-4 leading-tight">
            Manage Your School<br />
            <span className="gradient-text">Effortlessly</span>
          </h2>
          
          <p className="text-dark-300 text-lg max-w-md leading-relaxed">
            A comprehensive platform for students, teachers, and administrators 
            to streamline educational management.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { label: 'Students', value: '2.5K+' },
              { label: 'Teachers', value: '150+' },
              { label: 'Schools', value: '25+' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                <p className="text-sm text-dark-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-dark-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">EduPro</h1>
              <p className="text-xs text-primary-400">School Management</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-dark-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-200">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-dark-800 border border-dark-700 text-white placeholder-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500/20"
                />
                <span className="text-sm text-dark-300">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <Button 
              type="submit" 
              loading={loading}
              className="w-full py-3"
            >
              Sign In
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-4 rounded-xl glass-light">
            <p className="text-sm font-medium text-dark-300 mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-xs font-mono">
              <p className="text-dark-400">
                <span className="text-primary-400">Admin:</span> admin@school.com / admin123
              </p>
              <p className="text-dark-400">
                <span className="text-accent-400">Teacher:</span> teacher@school.com / teacher123
              </p>
              <p className="text-dark-400">
                <span className="text-blue-400">Student:</span> student@school.com / student123
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-dark-400">
            Don't have an account?{' '}
            <span className="text-primary-400">Contact your administrator</span>
          </p>
        </div>
      </div>
    </div>
  );
}

