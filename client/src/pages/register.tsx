import { useState, useContext } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "@/App";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { AppleLoginButton } from "@/components/auth/AppleLoginButton";

const Register = () => {
  const [_, navigate] = useLocation();
  const { login } = useContext(AuthContext);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      valid = false;
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }
    
    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { username, email, password, name } = formData;
      
      const response = await apiRequest("POST", "/api/auth/register", {
        username,
        email,
        password,
        name
      });
      
      const data = await response.json();
      
      login(data.token, data.user);
      
      toast({
        title: "Registration Successful",
        description: "Welcome to Healside! Your account has been created.",
      });
      
      // Redirect to home page or previous page
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle specific error messages from backend
      if (error.message.includes("Username already exists")) {
        setErrors(prev => ({
          ...prev,
          username: "Username already exists"
        }));
      } else if (error.message.includes("Email already exists")) {
        setErrors(prev => ({
          ...prev,
          email: "Email already exists"
        }));
      } else {
        toast({
          title: "Registration Failed",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register | Healside</title>
        <meta name="description" content="Create your account to access wellness products from around the world." />
      </Helmet>

      <div className="healside-container py-16">
        <motion.div 
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-poppins font-bold mb-6 text-center">Create an Account</h1>
          <p className="text-center text-foreground/70 mb-8">Join our global wellness community and discover curated healing products from around the world.</p>
          
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full ${errors.username ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                  required
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name (Optional)</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full ${errors.password ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
              
              <p className="text-center text-sm text-foreground/70">
                By creating an account, you agree to our <a href="#" className="text-accent hover:underline">Terms of Service</a> and <a href="#" className="text-accent hover:underline">Privacy Policy</a>.
              </p>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with social account
                  </span>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <GoogleLoginButton />
                <AppleLoginButton />
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-foreground/70">
                Already have an account? <a href="#" onClick={() => navigate("/login")} className="text-accent hover:underline">Log In</a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Register;
