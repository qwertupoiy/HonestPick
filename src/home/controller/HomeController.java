package home.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import home.Class.Home;

@WebServlet("/Home_servlet/*")
public class HomeController extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		
		String path = request.getContextPath();
		
		String url = request.getRequestURL().toString();
		
		request.setAttribute("path", path);
		
		// HonestPick_home
		if (url.contains("home.do")) {
			Home home = new Home();
			home.process(request, response, path);
		
		// none
		} else {
			System.out.println("== Home Controller Contains None ==");
			return;
		}
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
}