using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FitnessCenterApp.Models
{
    public class Address
    {
        public Address(string streetAndNumber, string city, string postalCode)
        {
            StreetAndNumber = streetAndNumber;
            City = city;
            PostalCode = postalCode;
        }

        public Address()
        {

        }

        public string StreetAndNumber { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }

        
    }
}