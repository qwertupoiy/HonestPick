package admin.Class;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import admin.controller.AdminCommand;
import admin.dao.AdminDAO;
import admin.dto.AdvertisementDTO;

public class Admin_ads implements AdminCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		List<String> listIn = new ArrayList<>();
    	listIn.add("SELECT COUNT(*) AS result FROM Advertisement");
    	listIn.add("SELECT COUNT(*) AS result FROM Advertisement WHERE AdRegidate BETWEEN SYSDATE-7 AND SYSDATE");
    	
    	listIn.add("SELECT COUNT(*) AS result FROM Advertisement WHERE AdEndDate > SYSDATE");
    	listIn.add("SELECT COUNT(*) AS result FROM Advertisement WHERE AdEndDate > SYSDATE AND AdRegidate BETWEEN SYSDATE-7 AND SYSDATE");
    	
    	listIn.add("SELECT COUNT(*) AS result FROM Advertisement WHERE AdEndDate BETWEEN SYSDATE-7 AND SYSDATE");
    	
    	listIn.add("SELECT COUNT(*) AS result FROM Advertisement WHERE AdEndDate < SYSDATE");
    	listIn.add("SELECT COUNT(*) AS result FROM Advertisement WHERE AdEndDate < SYSDATE AND AdRegidate BETWEEN SYSDATE-7 AND SYSDATE");
    	AdminDAO dao = new AdminDAO();
    	List<Integer> listOut = dao.AllAds(listIn);
    	
    	request.setAttribute("listOut", listOut);
    	
    	
        List<AdvertisementDTO> listAd = dao.getSelectAll_Ad(); 
        
        for(int i = 0; i < listAd.size(); i++) {
        	String memberImage = listAd.get(i).getAdImage();
        	
        	if (memberImage == null || memberImage.equals("-")) {
        		listAd.get(i).setAdImage("none.jpg");
        	} else {
        		String[] partsImage = listAd.get(i).getAdImage().split("\\|");
        		if (partsImage.length > 1) {
        			listAd.get(i).setAdImage(partsImage[1]);
        		} else {
        			listAd.get(i).setAdImage(partsImage[0]);
        		}
        	}
        }
        
        request.setAttribute("listAd", listAd);
        request.getRequestDispatcher("/WEB-INF/page/admin/admin_ads.jsp").forward(request, response);
    }
}