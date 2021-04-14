using Geta.inRiver.Commands;
using inRiver.Remoting.Extension;

namespace InboundExtensions
{
    public class CommandExtension : CommandExtensionBase
    {
        public override inRiverContext Context
        {
            get => base.Context;
            set
            {
                base.Context = value;
                //LogUtils.ConfigureLoggingFromXml(value);
                AddCommandSource(
                    commandSource: new CoreCommands(value),
                    prefix: "Core");
            }
        }
    }
}
