package admin.Class;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import admin.controller.AdminCommand;
import admin.dao.AdminDAO;
import store.dto.StoreDTO;

public class Admin_stores implements AdminCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		// for counting results
		List<String> listIn = new ArrayList<>();
    	listIn.add("SELECT COUNT(*) AS result FROM STORE");
    	listIn.add("SELECT COUNT(*) AS result FROM STORE WHERE STOREREGIDATE BETWEEN SYSDATE-7 AND SYSDATE");
    	listIn.add("SELECT AVG(REVIEWESTIMATION) AS result FROM REVIEW");
    	listIn.add("SELECT AVG(REVIEWESTIMATION) AS result FROM REVIEW WHERE REVIEWREGIDATE BETWEEN SYSDATE - 30 AND SYSDATE");
    	
    	AdminDAO dao = new AdminDAO();
    	List<Integer> listOut = dao.AllStore(listIn);
    	
    	request.setAttribute("listOut", listOut);
        
    	// Store's list
    	AdminDAO daoSto = new AdminDAO();
        List<StoreDTO> listStore = daoSto.StoreInfoWithOwnerName(); 
        
        for(int i = 0; i < listStore.size(); i++) {
        	String storeImage = listStore.get(i).getStoreImage();
        	
        	if (storeImage == null || storeImage.equals("-")) {
        		listStore.get(i).setStoreImage("store_none.jpg");
        	} else {
        		String[] partsImage = listStore.get(i).getStoreImage().split("\\|");
        		if (partsImage.length > 1) {
        			listStore.get(i).setStoreImage(partsImage[1]);
        		} else {
        			listStore.get(i).setStoreImage(partsImage[0]);
        		}
        	}
        	
        	String storeAddr = listStore.get(i).getStoreAddr();
        	
        	if(storeAddr != null && !storeAddr.trim().isEmpty()) {
        		String[] partsAddr = storeAddr.split("\\s+");
        		if(partsAddr.length >= 2) {
        			listStore.get(i).setStoreAddr(partsAddr[0] + " " + partsAddr[1]);
        		} else {
        			listStore.get(i).setStoreAddr(partsAddr[0]);
        		}
        	}
        }
        
        request.setAttribute("listStore", listStore);
        
        request.getRequestDispatcher("/WEB-INF/page/admin/admin_stores.jsp").forward(request, response);
    }
}