using CourseWork.ViewModels;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CourseWork.DataLayer
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions
    <DataContext> options) : base(options)
        {
        }
        public DbSet<Note> Notes { get; set; }


        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer(@"Data Source=(localdb)\MSSQLLocalDB;Database=CourseWork;Trusted_Connection=True;");
        //}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }

}
