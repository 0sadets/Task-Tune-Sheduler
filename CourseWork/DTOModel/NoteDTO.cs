using System;

namespace CourseWork.DTOModel
{
    public class NoteDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool Status { get; set; }
        public DateTime DateCreation { get; set; }
        public DateTime EndDate { get; set; }
        public string User { get; set; }
    }
}
