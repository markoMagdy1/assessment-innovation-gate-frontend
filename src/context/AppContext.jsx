import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
     const BASE_URL = "https://portal.banknoteconsult.com/api";
    // const BASE_URL = "http://127.0.0.1:8000/api";
  
  const [searchKey, setSearchKey] = useState("");
  const [filters, setFilters] = useState({});

  const [socialMedia, setSocialMedia] = useState({
    social: [
      {
        type: "messanger",
        link: "https://m.me/Banknoteeg",
      },
      {
        type: "instagram",
        link: "www.instegram.com",
      },
      {
        type: "telegram",
        link: "https://t.me/Banknote_Financial_Consulting",
      },
      {
        type: "whatsapp",
        link: "https://api.whatsapp.com/send?phone=201000046940",
      },
      {
        type: "email",
        link: "info@banknoteconsult.com",
      },
    ],
    phones:[
      '+(20) 1000046940',
      '+(20) 1029999489'
    ]
  });

  return <AppContext.Provider value={{ searchKey, setSearchKey, filters, setFilters ,socialMedia,BASE_URL}}>{children}</AppContext.Provider>;
};
