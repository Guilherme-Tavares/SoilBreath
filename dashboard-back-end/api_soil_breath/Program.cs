using api_soil_breath.Data;
using api_soil_breath.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Registrar DbContext
builder.Services.AddDbContext<DataBaseConfig>(options =>
    options.UseMySql(
        "server=localhost;database=db_soil;user=root;password=root;",
        new MySqlServerVersion(new Version(8, 0, 33))
    )
);

// Registrar HttpClient (necessario para IHttpClientFactory)
builder.Services.AddHttpClient();

// Registrar HostedService
builder.Services.AddHostedService<ChamadaEsp32Service>();
builder.Services.AddScoped<SoloService>();

// Add controllers e Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
