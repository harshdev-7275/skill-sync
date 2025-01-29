import { RootState } from "@/store/store"
import { toast } from "../../hooks/use-toast"
import axiosInstance from "../../lib/axiosInstance"
import { setLearningForm, setLearningFormSubmitSuccessFullyGlobal, setModuleGenerated } from "../../slices/chatBotSlice"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

interface LearningFormProps {
    setIsLearningFormSubmitSuccessFully: React.Dispatch<React.SetStateAction<boolean>>
    setIsLearningFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const LearningForm = ({ setIsLearningFormSubmitSuccessFully, setIsLearningFormOpen }: LearningFormProps) => {
    const token = useSelector((state: RootState) => state.auth.token);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ language: "", level: "" });
    const [error, setError] = useState("");


    const generateModules = async (subjectName: string, level: string) => {
        try {
            const response = await axiosInstance.post("/learning/generate-course-module", {
                subjectName, 
                level,
            },{
                timeout: 50000,
            })
            console.log("response in generate modules", response.data)
            if(response.data.success === true){
                dispatch(setModuleGenerated(true))
            }
        } catch (error) {
            console.error("Error in generate modules", error);
        }
    }
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!formData.language || !formData.level) {
        setError("Please fill in all fields");
        return;
      }
      try {
        const response = await axiosInstance.post(
          "/learning/save-initial-learning",
          {
            programmingLanguages: formData.language,
            level: formData.level,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          setIsLearningFormSubmitSuccessFully(true);
          toast({
            title: "Success",
            description: "Learning form submitted successfully",
            className: "bg-green-200 text-black",
          });
          setIsLearningFormOpen(false);
          dispatch(setLearningForm(false));
          generateModules("Javascript", "Beginner")
          dispatch(setLearningFormSubmitSuccessFullyGlobal(true))
        }
      } catch (error) {
        setError("Error submitting the form");
        console.error("Error in initial learning:", error);
      } finally {
        setError("");
      }
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-full max-w-md p-8 space-y-6 rounded-xl bg-gray-900 border border-blue-500/20">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tighter text-white">Programming Skills</h1>
            <p className="text-gray-400">Enter your programming language and skill level</p>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
               <label htmlFor="language" className="block text-sm font-medium text-white">
                 Programming Language
              </label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-blue-500/20 rounded-md 
                         text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="" disabled>
                  Select your programming language
                </option>
                <option value="JAVASCRIPT">JavaScript</option>
                <option value="PYTHON">Python</option>
                <option value="REACTJS">ReactJS</option>
              </select>
            </div>
  
            <div className="space-y-2">
              <label htmlFor="level" className="block text-sm font-medium text-white">
                Skill Level
              </label>
              <select
                id="level"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-blue-500/20 rounded-md 
                         text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="" disabled>
                  Select your skill level
                </option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCE">Advanced</option>
              </select>
            </div>
  
            {error && <p className="text-red-400 text-sm">{error}</p>}
  
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md 
                       transition-colors duration-200 focus:outline-none focus:ring-2 
                       focus:ring-blue-500/40"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default LearningForm;
  