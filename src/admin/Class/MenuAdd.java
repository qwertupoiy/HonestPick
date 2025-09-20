package admin.Class;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import admin.controller.AdminCommand;

public class MenuAdd implements AdminCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		int StoreNo = Integer.parseInt(request.getParameter("StoreNo"));
		
		request.setAttribute("StoreNo", StoreNo);
		
		RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/admin/menuAdd.jsp");
        rd.forward(request, response);
    }
}
