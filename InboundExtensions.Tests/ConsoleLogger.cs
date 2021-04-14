using inRiver.Remoting.Extension;
using System;
using inRiver.Remoting.Log;

namespace InboundExtension.Tests
{
    public class ConsoleLogger : IExtensionLog
    {
        public void Log(LogLevel level, string message)
        {
            Console.WriteLine($"{level}: {message}");
        }

        public void Log(LogLevel level, string message, Exception ex)
        {
            Console.WriteLine($"{level}: {message} {ex.Message}");
        }
    }
}
