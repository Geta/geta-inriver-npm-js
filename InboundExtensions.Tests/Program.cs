using System;
using inRiver.Remoting;
using inRiver.Remoting.Extension;
using System.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using InboundExtensions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace InboundExtension.Tests
{
    class Program
    {
        private static readonly string UserName = ConfigurationManager.AppSettings["inRiver:Username"];
        private static readonly string Password = ConfigurationManager.AppSettings["inRiver:Password"];
        private static readonly string Environment = ConfigurationManager.AppSettings["inRiver:Environment"];
        private static readonly string RemotingUrl = ConfigurationManager.AppSettings["inRiver:RemotingUrl"];

        private static readonly string ExtensionUrl = ConfigurationManager.AppSettings["inRiver:ExtensionUrl"];
        private static readonly string Controller = ConfigurationManager.AppSettings["inRiver:Controller"];
        private static readonly string Customer = ConfigurationManager.AppSettings["inRiver:Customer"];
        private static readonly string ExtensionId = ConfigurationManager.AppSettings["inRiver:ExtensionId"];
        private static readonly string ApiKey = ConfigurationManager.AppSettings["inRiver:ExtensionKey"];

        static async Task Main(string[] args)
        {
            var manager = RemoteManager.CreateInstance(RemotingUrl, UserName, Password, Environment);
            var context = new inRiverContext(manager, new ConsoleLogger());

            TestLocal(context);
            await TestRemote(context);
        }

        static void TestLocal(inRiverContext context)
        {
            var commands = new CommandExtension { Context = context };

            var json = new JObject
            {
                {"function", "Core.GetSettings"},
                {"args", new JObject()}
            };

            var responseContent = commands.Add(JsonConvert.SerializeObject(json));
            var asToken = GetJtokenFromResponse(responseContent);
        }

        static async Task TestRemote(inRiverContext context)
        {
            var authHeaderValueBytes = Encoding.ASCII.GetBytes("apikey:" + ApiKey);
            var authHeaderValue = Convert.ToBase64String(authHeaderValueBytes);

            var client = new HttpClient();
            client.BaseAddress = new Uri($"{ExtensionUrl}/{Controller}/{Customer}/{Environment}/{ExtensionId}");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authHeaderValue);

            var json = new JObject
            {
                {"function", "Core.GetSettings"},
                {"args", new JObject()}
            };

            var content = new StringContent(JsonConvert.SerializeObject(json), Encoding.UTF8, "application/json");
            var response = await client.PostAsync("", content);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"POST to inRiver failed: '{response.ReasonPhrase}'.");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var asToken = GetJtokenFromResponse(responseContent);
        }

        static JToken GetJtokenFromResponse(string response)
        {
            JToken jtoken = null;
            try
            {
                jtoken = JToken.Parse(response);
            }
            catch (JsonReaderException)
            {
                throw new Exception("Unable to parse Json content.");
            }

            if (jtoken.Type != JTokenType.Object)
            {
                throw new Exception("Json response not an object.");
            }

            var jobject = (JObject)jtoken;

            var statusObj = jobject["status"];
            if (statusObj == null)
            {
                throw new Exception("No status property on response object.");
            }

            if (statusObj.Type != JTokenType.String)
            {
                throw new Exception($"Expected status property of type String, got {statusObj.Type}.");
            }

            var statusString = statusObj.Value<string>();
            if (statusString != "ok")
            {
                throw new Exception($"Request non-ok status: '{statusString}'.");
            }

            var bodyObj = jobject["body"];

            return bodyObj;
        }
    }
}
