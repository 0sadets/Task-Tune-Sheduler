using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System;

namespace CourseWork.ViewModels
{
    public class User : IdentityUser
    {
        public User()
        {
            Notes = new List<Note>();
        }

        [Required]
        public DateTime Birthday { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string MiddleName { get; set; }

        public ICollection<Note> Notes { get; set; }


    }
}
