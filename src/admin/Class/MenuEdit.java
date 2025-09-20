package admin.Class;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import admin.controller.AdminCommand;
import store.dao.StoreDAO;
import store.dto.MenuDTO;
import store.dto.StoreDTO;

public class MenuEdit implements AdminCommand {
	public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
		int StoreNo = Integer.parseInt(request.getParameter("StoreNo"));
		int MenuNo = Integer.parseInt(request.getParameter("MenuNo"));
		
		MenuDTO dtoAg = new MenuDTO();
		dtoAg.setStoreNo(StoreNo);
		dtoAg.setMenuNo(MenuNo);
		
		StoreDAO dao = new StoreDAO();
		
		// Store owner check
		StoreDTO dtoAgStore = new StoreDTO();
		dtoAgStore.setStoreNo(StoreNo);
		HttpSession session = request.getSession();
		int sessMemberNo = (int) session.getAttribute("MemberNo");
		if (dao.getSelectOne(dtoAgStore).getMemberNo() != sessMemberNo) {
			response.sendRedirect(path + "/Home_servlet/home.do");
			return;
		}
		
		MenuDTO dtoMenu = dao.getSelectOne(dtoAg);
		
		String MenufileName;
		if (dtoMenu.getMenuImage().equals("-")) {
			MenufileName = "none.jpg";
			dtoMenu.setMenuImage(MenufileName);
		} else {
			MenufileName = dtoMenu.getMenuImage().split("[|]")[1];
			dtoMenu.setMenuImage(MenufileName);
		}
		
		request.setAttribute("dtoMenu", dtoMenu);
		
		RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/page/admin/menuEdit.jsp");
        rd.forward(request, response);
    }
}
