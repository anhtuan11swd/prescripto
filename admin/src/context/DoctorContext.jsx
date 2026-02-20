import { createContext, useState } from "react";

const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : "",
  );

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const value = {
    backendUrl,
    dToken,
    setDToken,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export { DoctorContext };
export default DoctorContextProvider;
