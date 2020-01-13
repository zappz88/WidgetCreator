<%@ Page Title="" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
	<%-- This is where page customizations go. --%>
	<title>Query Dashboard</title>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="Main" Runat="Server">
	<div id="MainContainer" runat="server">
		<div id="Main" runat="server">
		</div>
	</div>
    <script>
		window.onload = () => {

            let main = document.getElementById('<%=Main.ClientID%>');
            main.classList.add('main');

            let displayContainer = document.createElement('div');
            displayContainer.classList.add('displayContainer');
            displayContainer.id = 'displayContainer';

            main.appendChild(displayContainer);

            let getAllQueries = JSON.parse(JSON.parse(loadAllQueries()));
            console.log(getAllQueries);

			getAllQueries.forEach(item => {
                if (item !== null) {
					displayContainer.append(createDefaultWidget(item));
				}
				else {
					console.log(item);
				}
			})

        };
    </script>
</asp:Content>
