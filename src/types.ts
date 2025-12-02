
export type Customer = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  streetaddress: string;
  postcode: string;
  city: string;
  _links: {
    self: { href: string };
  };
};

// Lomaketta varten käytettävä tyyppi uuden asiakkaan tietojen syöttöön
export type CustomerForm = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  streetaddress: string;
  postcode: string;
  city: string;
};


export type TrainingForm = {
  date: string;
  duration: number;
  activity: string;
  customer: string; 
};



export type Training = {
  date: string;      
  activity: string;
  duration: number;
  _links: {
    self: { href: string };
    customer?: { href: string };
  };
};


export type TrainingRow = Training & {
  customerName: string;
};
