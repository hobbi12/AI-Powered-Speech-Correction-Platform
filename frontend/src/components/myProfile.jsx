import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./navbar";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Shield,
  Brain,
  Sparkles,
  Edit,
  Camera,
  Trophy,
  Star,
  Target,
  X,
  Save,
  Upload,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function MyProfile() {

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  // const [token, setToken] = useState(null);
  const token=localStorage.getItem("token");
  console.log(token)
  // Form state
  const [formData, setFormData] = useState({
    bio: "",
    country: "",
    governorate: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  // const token=localStorage.getItem("token");
  // console.log(token)
  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = () => {
    const storedToken = localStorage.getItem("token");
  
    if (!storedToken) {
      setError("لم يتم العثور على التوكن. الرجاء تسجيل الدخول مرة أخرى.");
      setLoading(false);
      return;
    }
  
    setLoading(true);
    setError(null);
  
    fetch("http://localhost:9999/api/profile/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${storedToken}`, // ✅ تم التعديل هنا
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProfileData(data);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching profile", err);
        setError(err.message);
        setLoading(false);
      });
  };
  

  const openEditModal = () => {
    if (profileData && profileData.profile) {
      setFormData({
        bio: profileData.profile.bio || "",
        country: profileData.profile.country || "",
        governorate: profileData.profile.governorate || "",
      });
      setPreviewImage(profileData.profile.profile_picture || null);
      setProfilePicture(null);
      setEditError(null);
      setEditSuccess(false);
      setShowEditModal(true);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setFormData({ bio: "", country: "", governorate: "" });
    setProfilePicture(null);
    setPreviewImage(null);
    setEditError(null);
    setEditSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(false);
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("governorate", formData.governorate);
  
      if (profilePicture) {
        formDataToSend.append("profile_picture", profilePicture);
      }
  
      const response = await fetch("http://localhost:9999/api/profile/update/", {
        method: "PUT",
        headers: {
          Authorization: `Token ${token}`, // ✅ تم التعديل هنا
        },
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
  
      const updatedData = await response.json();
      setProfileData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...updatedData,
        },
      }));
  
      setEditSuccess(true);
      setTimeout(() => {
        closeEditModal();
        setEditSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Error updating profile", err);
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };
  

  if (loading) {
    return (
      <div className="relative flex items-center justify-center h-screen bg-gradient-dark">
        {/* Cyber Grid Background */}
        <div className="fixed inset-0 cyber-grid opacity-10 z-[-2]"></div>

        {/* Particle Effects */}
        <div className="fixed inset-0 particles z-[-1]"></div>

        <div className="card-gradient p-8 text-center animate-fade-in-up">
          <div className="spinner mx-auto mb-4"></div>
          <div className="text-white text-xl font-medium">
            Loading your AI profile...
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="relative flex items-center justify-center h-screen bg-gradient-dark">
        {/* Cyber Grid Background */}
        <div className="fixed inset-0 cyber-grid opacity-10 z-[-2]"></div>

        {/* Particle Effects */}
        <div className="fixed inset-0 particles z-[-1]"></div>

        <div className="card-gradient p-8 text-center animate-fade-in-up">
          <div className="text-red-400 text-lg mb-4">
            {error || "No profile data found."}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Ensure we have the required data structure
  const { user, profile } = profileData;

  if (!user || !profile) {
    return (
      <div className="relative flex items-center justify-center h-screen bg-gradient-dark">
        {/* Cyber Grid Background */}
        <div className="fixed inset-0 cyber-grid opacity-10 z-[-2]"></div>

        {/* Particle Effects */}
        <div className="fixed inset-0 particles z-[-1]"></div>

        <div className="card-gradient p-8 text-center animate-fade-in-up">
          <div className="text-red-400 text-lg">
            Invalid profile data structure.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-dark text-white min-h-screen">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 cyber-grid opacity-10 z-[-2]"></div>

      {/* Particle Effects */}
      <div className="fixed inset-0 particles z-[-1]"></div>

      <Navbar />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-blue px-6 py-3 rounded-full text-sm font-medium mb-6 animate-fade-in-down border border-neon-blue/30 backdrop-blur-md">
              <User className="w-4 h-4 animate-pulse" />
              AI-Powered Profile
            </div>
            <h1 className="text-responsive-xl font-bold text-white mb-4">
              My{" "}
              <span className="gradient-text" data-text="Profile">
                Profile
              </span>
            </h1>
            <p className="text-cyber-300 text-lg">
              Your personalized AI learning dashboard and progress tracker
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="card-gradient p-8 text-center animate-fade-in-left">
                {/* Profile Picture */}
                <div className="relative mb-6">
                  {profile.profile_picture ? (
                    <img
                      src={profile.profile_picture}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-neon-blue/30 shadow-neon-blue mx-auto"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-cyber-800/50 flex items-center justify-center text-cyber-400 border-4 border-neon-blue/30 shadow-neon-blue mx-auto">
                      <Camera className="w-12 h-12" />
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  {user.username || "User"}
                </h2>
                <p className="text-cyber-300 mb-6">AI Learning Enthusiast</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-cyber-800/30 p-4 rounded-xl border border-cyber-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-neon-green" />
                      <span className="text-white font-bold">12</span>
                    </div>
                    <p className="text-cyber-300 text-sm">Achievements</p>
                  </div>
                  <div className="bg-cyber-800/30 p-4 rounded-xl border border-cyber-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-neon-yellow" />
                      <span className="text-white font-bold">4.8</span>
                    </div>
                    <p className="text-cyber-300 text-sm">Rating</p>
                  </div>
                </div>

                <button
                  onClick={openEditModal}
                  className="btn-primary w-full group"
                >
                  <Edit className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="card-gradient p-8 animate-fade-in-right">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <Brain className="w-6 h-6 text-neon-blue" />
                  Profile Information
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-neon-blue/20 rounded-xl flex items-center justify-center group-hover:bg-neon-blue/30 transition-all duration-300">
                      <User className="w-6 h-6 text-neon-blue" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-cyber-200 text-sm font-medium mb-1">
                        Username
                      </h4>
                      <p className="text-white font-semibold">
                        {user.username || "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-neon-green/20 rounded-xl flex items-center justify-center group-hover:bg-neon-green/30 transition-all duration-300">
                      <Mail className="w-6 h-6 text-neon-green" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-cyber-200 text-sm font-medium mb-1">
                        Email
                      </h4>
                      <p className="text-white font-semibold">
                        {user.email || "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-neon-purple/20 rounded-xl flex items-center justify-center group-hover:bg-neon-purple/30 transition-all duration-300">
                      <FileText className="w-6 h-6 text-neon-purple" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-cyber-200 text-sm font-medium mb-1">
                        Bio
                      </h4>
                      <p className="text-white">
                        {profile.bio || "No bio provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-neon-cyan/20 rounded-xl flex items-center justify-center group-hover:bg-neon-cyan/30 transition-all duration-300">
                      <MapPin className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-cyber-200 text-sm font-medium mb-1">
                        Country
                      </h4>
                      <p className="text-white">
                        {profile.country || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {profile.governorate && (
                    <div className="flex items-start space-x-4 group">
                      <div className="w-12 h-12 bg-neon-pink/20 rounded-xl flex items-center justify-center group-hover:bg-neon-pink/30 transition-all duration-300">
                        <MapPin className="w-6 h-6 text-neon-pink" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-cyber-200 text-sm font-medium mb-1">
                          Governorate
                        </h4>
                        <p className="text-white">{profile.governorate}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-neon-pink/20 rounded-xl flex items-center justify-center group-hover:bg-neon-pink/30 transition-all duration-300">
                      <Calendar className="w-6 h-6 text-neon-pink" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-cyber-200 text-sm font-medium mb-1">
                        Member Since
                      </h4>
                      <p className="text-white">
                        {profile.created_at
                          ? new Date(profile.created_at).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Progress Section */}
              <div
                className="card-gradient p-8 mt-8 animate-fade-in-right"
                style={{ animationDelay: "200ms" }}
              >
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-neon-green" />
                  AI Learning Progress
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-cyber-800/30 p-6 rounded-xl border border-cyber-700/50 hover-lift">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950">
                        <Brain className="w-5 h-5" />
                      </div>
                      <h4 className="text-white font-semibold">
                        Lessons Completed
                      </h4>
                    </div>
                    <p className="text-3xl font-bold text-neon-blue mb-2">24</p>
                    <p className="text-cyber-300 text-sm">This month</p>
                  </div>

                  <div className="bg-cyber-800/30 p-6 rounded-xl border border-cyber-700/50 hover-lift">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950">
                        <Target className="w-5 h-5" />
                      </div>
                      <h4 className="text-white font-semibold">
                        Accuracy Rate
                      </h4>
                    </div>
                    <p className="text-3xl font-bold text-neon-green mb-2">
                      87%
                    </p>
                    <p className="text-cyber-300 text-sm">Average score</p>
                  </div>

                  <div className="bg-cyber-800/30 p-6 rounded-xl border border-cyber-700/50 hover-lift">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950">
                        <Shield className="w-5 h-5" />
                      </div>
                      <h4 className="text-white font-semibold">
                        Learning Streak
                      </h4>
                    </div>
                    <p className="text-3xl font-bold text-neon-purple mb-2">
                      15
                    </p>
                    <p className="text-cyber-300 text-sm">Days in a row</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-gradient p-8 rounded-3xl shadow-glass border border-neon-blue/20 backdrop-blur-md w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Edit className="w-6 h-6 text-neon-blue" />
                Edit Profile
              </h2>
              <button
                onClick={closeEditModal}
                className="w-10 h-10 bg-cyber-800/50 rounded-full flex items-center justify-center text-cyber-300 hover:text-white hover:bg-cyber-700/50 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Message */}
            {editSuccess && (
              <div className="mb-6 p-4 bg-neon-green/10 border border-neon-green/30 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-neon-green" />
                <span className="text-neon-green font-medium">
                  Profile updated successfully!
                </span>
              </div>
            )}

            {/* Error Message */}
            {editError && (
              <div className="mb-6 p-4 bg-neon-red/10 border border-neon-red/30 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-neon-red" />
                <span className="text-neon-red font-medium">{editError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-neon-blue/30 shadow-neon-blue">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-cyber-800/50 flex items-center justify-center text-cyber-400">
                        <Camera className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow cursor-pointer hover:scale-110 transition-transform duration-300">
                    <Upload className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-cyber-300 text-sm mt-2">
                  Click to upload new profile picture
                </p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-cyber-200 text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-cyber-800/50 border border-cyber-700/50 rounded-xl px-4 py-3 text-white placeholder-cyber-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300 backdrop-blur-md"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-cyber-200 text-sm font-medium mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-cyber-800/50 border border-cyber-700/50 rounded-xl px-4 py-3 text-white placeholder-cyber-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300 backdrop-blur-md"
                  placeholder="Enter your country"
                />
              </div>

              {/* Governorate */}
              <div>
                <label className="block text-cyber-200 text-sm font-medium mb-2">
                  Governorate
                </label>
                <input
                  type="text"
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleInputChange}
                  className="w-full bg-cyber-800/50 border border-cyber-700/50 rounded-xl px-4 py-3 text-white placeholder-cyber-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-neon-blue transition-all duration-300 backdrop-blur-md"
                  placeholder="Enter your governorate"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className={`btn-primary flex-1 flex items-center justify-center gap-2 ${
                    editLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {editLoading ? (
                    <>
                      <div className="spinner w-4 h-4"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
