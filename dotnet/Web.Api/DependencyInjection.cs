using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sabio.Data;
using Sabio.Models.Domain;
using Sabio.Models.Interfaces;
using Sabio.Services;
using Sabio.Services.Email;
using Sabio.Services.Interfaces;
using Sabio.Web.Api.StartUp.DependencyInjection;
using Sabio.Web.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Sabio.Web.StartUp
{
    public class DependencyInjection
    {
        public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            if (configuration is IConfigurationRoot)
            {
                services.AddSingleton<IConfigurationRoot>(configuration as IConfigurationRoot);   // IConfigurationRoot
            }
            services.AddSingleton<IConfiguration>(configuration);   // IConfiguration explicitly

            string connString = configuration.GetConnectionString("Default");
            // https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-2.2
            // The are a number of different Add* methods you can use. Please verify which one you
            // should be using services.AddScoped<IMyDependency, MyDependency>();

            // services.AddTransient<IOperationTransient, Operation>();

            // services.AddScoped<IOperationScoped, Operation>();

            // services.AddSingleton<IOperationSingleton, Operation>();

            services.AddSingleton<IAuthenticationService<int>, WebAuthenticationService>();

            services.AddSingleton<Sabio.Data.Providers.IDataProvider, SqlDataProvider>(delegate (IServiceProvider provider)
            {
                return new SqlDataProvider(connString);
            });

            //add singletons below this comment

            services.AddSingleton<IAdminAnalyticsService, AdminAnalyticService>();
            services.AddSingleton<IAlternateIngredientsService, AlternateIngredientsService>();
            services.AddSingleton<IBlogService, BlogService>();
            services.AddSingleton<ICartService, CartService>();
            services.AddSingleton<ICheckoutService, CheckoutService>();
            services.AddSingleton<ICommentService, CommentService>();
            services.AddSingleton<IDiscountsService, DiscountsService>();
            services.AddSingleton<IEmailService, EmailService>();
            services.AddSingleton<IEmployeeService, EmployeeService>();
            services.AddSingleton<IFaqService, FaqService>();
            services.AddSingleton<IFileService, FileService>();
            services.AddSingleton<IGoogleAnalyticsService, GoogleAnalyticsService>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IIdentityProvider<int>, WebAuthenticationService>();
            services.AddSingleton<IIngredientsService, IngredientsService>();
            services.AddSingleton<ILicensesService, LicensesService>();
            services.AddSingleton<ILookUpService, LookUpService>();
            services.AddSingleton<ILocationService, LocationService>();
            services.AddSingleton<ILookUpService, LookUpService>();
            services.AddSingleton<IMenuItemSpecialService, MenuItemSpecialService>();
            services.AddSingleton<IMenuItemsService, MenuItemsService>();
            services.AddSingleton<IMenuModificationService, MenuModificationService>();
            services.AddSingleton<IMenuService, MenuService>();
            services.AddSingleton<IMessageService, MessageService>();
            services.AddSingleton<INewsletterContentService, NewsletterContentService>();
            services.AddSingleton<INewsletterSubscriptionService, NewsletterSubscriptionService>();
            services.AddSingleton<INewslettersService, NewslettersService>();
            services.AddSingleton<INewsletterTemplatesService, NewsletterTemplatesService>();
            services.AddSingleton<IOrderService, OrderService>();
            services.AddSingleton<IOrderStatusService, OrderStatusService>();
            services.AddSingleton<IOrganizationHoursService, OrganizationHoursService>();
            services.AddSingleton<IOrganizationService, OrganizationService>();
            services.AddSingleton<IOrgInviteService, OrgInviteService>();
            services.AddSingleton<IPaymentAccountsService, PaymentAccountsService>();
            services.AddSingleton<IProductService, ProductService>();
            services.AddSingleton<IQRLinksService, QRLinksService>();
            services.AddSingleton<IRatingService, RatingService>();
            services.AddSingleton<IRevenueService, RevenueService>();
            services.AddSingleton<IScheduleDiscountService, ScheduleDiscountService>();
            services.AddSingleton<ISeatingLocationService, SeatingLocationService>();
            services.AddSingleton<IShareStoriesService, ShareStoriesService>();
            services.AddSingleton<IStateService, StateService>();
            services.AddSingleton<ITagService, TagService>();
            services.AddSingleton<ITaxTagService, TaxTagService>();
            services.AddSingleton<ISubscriptionService, SubscriptionService>();
            services.AddSingleton<ITransactionService, TransactionService>();
            services.AddSingleton<IUserProfileService, UserProfileService>();
            services.AddSingleton<IUserService, UserService>();
            

            GetAllEntities().ForEach(tt =>
            {
                IConfigureDependencyInjection idi = Activator.CreateInstance(tt) as IConfigureDependencyInjection;
                //This will not error by way of being null. BUT if the code within the method does
                // then we would rather have the error loadly on startup then worry about debuging the issues as it runs
                idi.ConfigureServices(services, configuration);
            });
        }
        public static List<Type> GetAllEntities()
        {
            return AppDomain.CurrentDomain.GetAssemblies().SelectMany(x => x.GetTypes())
                 .Where(x => typeof(IConfigureDependencyInjection).IsAssignableFrom(x) && !x.IsInterface && !x.IsAbstract)
                 .ToList();
        }
        public static void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
        }
    }
}
