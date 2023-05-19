using CourseWork.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CourseWork.DataLayer
{
    public class Seeder
    {
        public static void SeedDb(IServiceProvider services, IConfiguration config)
        {
            using (var scope = services.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var manager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
                var managerRole = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var context = scope.ServiceProvider.GetRequiredService<DataContext>();
                SeedData(manager, managerRole, context);
            }
        }
        public static void SeedData(UserManager<User> userManager,
           RoleManager<IdentityRole> roleManager, DataContext context)
        {
            var roleName = "user";
            if (roleManager.FindByNameAsync(roleName).Result == null)
            {
                var resUserRole = roleManager.CreateAsync(new IdentityRole
                {
                    Name = roleName
                }).Result;
                var user = new User()
                {
                    UserName = "SashaOsadets",
                    Email = "sashaosadets@gmail.com",
                    PhoneNumber = "0968315057",
                    FirstName = "Олександра",
                    LastName = "Осадець",
                    MiddleName = "Романівна",
                    Birthday = new DateTime(2004, 08, 14)
                };
                var resultUser = userManager.CreateAsync(user, $"Qwerty1!").Result;
                resultUser = userManager.AddToRoleAsync(user, roleName).Result;
                context.SaveChanges();
            }
            var note1 = new Note()
            {
                Title = "Зробити домашню роботу",
                Description = "Ця нотатка призначена для тих, хто прагне успіху в навчанні та бажає ефективно організувати свій час. Ви зможете використати цю нотатку для складання списку домашніх завдань, що потребують вашої уваги.",
                DateCreation = DateTime.Now,
                EndDate = new DateTime(2023, 05, 20),
                UserId = context.Users.FirstOrDefault(x => x.Email == "sashaosadets@gmail.com").Id

            };
            context.SaveChanges();
            context.Users.FirstOrDefault(x => x.Email == "sashaosadets@gmail.com").Notes = new List<Note>()
            {
                note1
            };
            context.SaveChanges();
        }
    }
}
