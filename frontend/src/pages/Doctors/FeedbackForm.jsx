import { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL, token } from "./../../config";
import HashLoader from "react-spinners/HashLoader";

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!rating || !reviewText) {
        setLoading(false);
        toast.error("Rating & Review Fields are required");
      }
      const res = await fetch(`${BASE_URL}/doctors/${id}/reviews`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, reviewText }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }

      setLoading(false);
      toast.success(result.message);
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <form action="">
      <div>
        <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
          How would you rate the overall experience?*
        </h3>

        <div>
          {Array.from({ length: 5 }, (_, index) => {
            index += 1;
            return (
              <button
                key={index}
                type="button"
                className={`${
                  index <= ((rating && hover) || hover)
                    ? "text-yellowColor"
                    : "text-gray-400"
                } bg-transparent border-none outline-one text-[22px] cursor-pointer`}
                onClick={() => setRating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
                onDoubleClick={() => {
                  setHover(0);
                  setRating(0);
                }}
              >
                <span>
                  <AiFillStar />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-[30px]">
        <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
          Share your feedback or suggesions.
        </h3>

        <textarea
          className="border border-solid border-[#0066ff34] focus:outline outline-primaryColor 
        w-full px-4 py-3 rounded-md"
          placeholder="Write your message"
          onChange={(e) => setReviewText(e.target.value)}
          rows="5"
        ></textarea>
      </div>

      <button type="submit" onClick={handleSubmitReview} className="btn">
        {loading ? <HashLoader size={25} color="#fff" /> : "Submit Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;
