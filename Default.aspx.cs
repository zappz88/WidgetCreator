using Newtonsoft.Json;
using System;
using System.Data;
using System.Web.Script.Services;
using System.Web.Security;
using System.Web.Services;

public partial class _Default : System.Web.UI.Page
{
	[WebMethod]
	[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
	public static string GetQueries()
	{
		var data = new Data();
		var loadQueries = data.LoadQueries();
		return JsonConvert.SerializeObject(loadQueries);
	}

	[WebMethod]
	[ScriptMethod(ResponseFormat = ResponseFormat.Json)]
	public static string DataSwitch(string QueryObject)
	{
		try
		{
			QueryObjectModel queryObjectModel = JsonConvert.DeserializeObject<QueryObjectModel>(QueryObject);
			QueryResultModel queryResultModel = new QueryResultModel();

			string query = queryObjectModel.QueryText;

			if (queryObjectModel.InputParameters.Length > 0 && queryObjectModel.InputsArray.Length > 0)
			{
				query = StringUtils.ReplaceAll(queryObjectModel.QueryText, queryObjectModel.InputParameters, queryObjectModel.InputsArray, queryObjectModel.DataTypesArray);
			}

			Data data = new Data();
			var value = (DataTable)data.GetTableData(queryObjectModel.ServerName, queryObjectModel.DatabaseName, query);
			queryResultModel.Result = JsonConvert.SerializeObject(value);
			queryResultModel.ResultType = queryObjectModel.ResultType;
			queryResultModel.Caption = queryObjectModel.Caption;
			return JsonConvert.SerializeObject(queryResultModel);
		}
		catch (Exception ex)
		{
			return null;
		}
	}
}
