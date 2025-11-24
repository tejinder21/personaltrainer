
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
