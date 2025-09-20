package admin.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import admin.controller.AdminCommand;

public class Admin_ads_add implements AdminCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {

		
	request.getRequestDispatcher("/WEB-INF/page/admin/admin_ads_add.jsp").forward(request, response);
	}
}
