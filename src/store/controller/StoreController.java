package store.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import store.Class.Reservation;
import store.Class.RestaurantDetail;
import store.Class.StoreList;

@WebServlet("/Store_servlet/*")
public class StoreController extends HttpServlet {
	private static final long serialVersionUID = 1L;
    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		
		String path = request.getContextPath();
		String url = request.getRequestURL().toString();

		request.setAttribute("path", path);
		
		// storeList
		if (url.contains("storeList.do")) {
			StoreList storelist = new StoreList();
			storelist.process(request, response, path);
			
		// restaurantDetail
		} else if (url.contains("restaurantDetail.do")) {
			RestaurantDetail detail = new RestaurantDetail();
			detail.process(request, response, path);
			
		// reservation
		} else if (url.contains("reservationProc.do")) {
			Reservation reservation = new Reservation();
			reservation.processProc(request, response, path);
			
		// none
		} else {
			System.out.println("== Store Controller Contains None ==");
			return;
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
}
