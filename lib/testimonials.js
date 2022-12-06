import testimonials from "./testimonials.json";

export const getTestimonials = () => {
  return testimonials.testimonials.map(item => {
    return {
      ID: item?.ID,
      Date: item?.Date,
      Name: item?.Name,
      ProfilePic: item?.ProfilePic,
      Rating: item?.Rating,
      Testimonial: item?.Testimonial,
    };
  });
};
