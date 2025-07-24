package admin.Class;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import admin.controller.AdminCommand;
import admin.dao.AdminDAO;
import admin.dto.AdvertisementDTO;

public class Admin_ads_edit implements AdminCommand{
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		int adNo = Integer.parseInt(request.getParameter("adNo"));
		
		AdvertisementDTO dtoPm = new AdvertisementDTO();
		dtoPm.setAdNo(adNo);
		
		AdminDAO dao = new AdminDAO();
		
		dtoPm = dao.getSelectOne_Ad(dtoPm);
		
		String storeImage = dtoPm.getAdImage();
		
		if (storeImage == null || storeImage.equals("none.jpg") || storeImage.isEmpty()) {
    		dtoPm.setAdImage("none.jpg");
    	} else {
    		String[] partsImage = storeImage.split("\\|");
    		if (partsImage.length > 1) {
    			dtoPm.setAdImage(partsImage[1]);
    		} else {
    			dtoPm.setAdImage(partsImage[0]);
    		}
    	}
		
		request.setAttribute("ad", dtoPm);
		
		request.getRequestDispatcher("/WEB-INF/page/admin/admin_ads_edit.jsp").forward(request, response);
	}
	
}
