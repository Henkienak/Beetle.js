using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Web.Mvc.Async;

namespace Beetle.Mvc {
    using Server;
    using Server.Interface;
    using Properties;

    /// <summary>
    /// Imitate OData behavior for MVC Controllers.
    /// </summary>
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class BeetleActionFilterAttribute : ActionFilterAttribute {

        public BeetleActionFilterAttribute(Type configType = null) {
            if (configType == null) return;

            Config = Activator.CreateInstance(configType) as IBeetleConfig;
            if (Config == null) throw new ArgumentException(Resources.CannotCreateConfigInstance);
        }

        public BeetleActionFilterAttribute(IBeetleConfig config) {
            Config = config;
        }

        protected IBeetleConfig Config { get; }

        public int MaxResultCount { get; set; }

        public bool? CheckRequestHash { get; set; }

        public override void OnActionExecuting(ActionExecutingContext filterContext) {
            base.OnActionExecuting(filterContext);

            var controller = filterContext.Controller;
            var action = filterContext.ActionDescriptor;
            var service = controller as IBeetleService;

            MethodInfo actionMethod;
            if (action is ReflectedActionDescriptor reflectedAction) {
                actionMethod = reflectedAction.MethodInfo;
            }
            else {
                if (action is TaskAsyncActionDescriptor taskAsyncAction) {
                    actionMethod = taskAsyncAction.TaskMethodInfo;
                }
                else {
                    actionMethod = controller.GetType().GetMethod(
                        action.ActionName,
                        BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance | BindingFlags.InvokeMethod,
                        null,
                        action.GetParameters().Select(pd => pd.ParameterType).ToArray(),
                        null);

                    if (actionMethod == null) return;
                }
            }

            var returnType = actionMethod.ReturnType;
            // check if we should process the result of the action
            if (typeof(ActionResult).IsAssignableFrom(returnType) || typeof(Task).IsAssignableFrom(returnType))
                return;

            // translate the request query
            GetParameters(service, out string queryString, out IDictionary<string, string> queryParams);
            var beetleParameters = Server.Helper.GetBeetleParameters(queryParams);
            // execute the action method
            var contentValue = action.Execute(filterContext.Controller.ControllerContext, filterContext.ActionParameters);
            var actionContext = new ActionContext(action.ActionName, contentValue, 
                                                  queryString, beetleParameters, 
                                                  MaxResultCount, CheckRequestHash, 
                                                  Config, service);
            var processResult = ProcessRequest(actionContext);
            filterContext.Result = HandleResponse(processResult);
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext) {
            base.OnActionExecuted(filterContext);

            if (!(filterContext.Result is BeetleContentResult contentResult)) return;

            var contentValue = contentResult.Value;
            var action = filterContext.ActionDescriptor;
            var service = filterContext.Controller as IBeetleService;

            // translate the request query
            GetParameters(service, out string queryString, out IDictionary<string, string> queryParams);
            var beetlePrms = Server.Helper.GetBeetleParameters(queryParams);
            var actionContext = new ActionContext(action.ActionName, contentValue, 
                                                  queryString, beetlePrms, 
                                                  MaxResultCount, CheckRequestHash,
                                                  Config, service);
            var processResult = ProcessRequest(actionContext);
            filterContext.Result = HandleResponse(processResult);
        }

        protected virtual void GetParameters(IBeetleService service, 
                                             out string queryString, 
                                             out IDictionary<string, string> queryParams) {
            var config = Config ?? service?.Config;
            Helper.GetParameters(config, out queryString, out queryParams);
        }

        protected virtual ProcessResult ProcessRequest(ActionContext actionContext) {
            var service = actionContext.Service;
            return service != null
                ? service.ProcessRequest(actionContext)
                : Helper.ProcessRequest(actionContext);
        }

        protected virtual ActionResult HandleResponse(ProcessResult result) {
            return Helper.HandleResponse(result);
        }
    }
}
