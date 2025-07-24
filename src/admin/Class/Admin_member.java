package admin.Class;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import admin.controller.AdminCommand;
import admin.dao.AdminDAO;
import member.dao.MemberDAO;
import member.dto.MemberDTO;

public class Admin_member implements AdminCommand {
    public void execute(HttpServletRequest request, HttpServletResponse response, String path) throws ServletException, IOException {
    	List<String[]> listIn = new ArrayList<>();
    	listIn.add(new String[] {"MEMBER", ""});
    	listIn.add(new String[] {"MEMBER", "WHERE MEMBERREGIDATE BETWEEN SYSDATE-7 AND SYSDATE"});
    	listIn.add(new String[] {"MEMBER", "WHERE ADMIN = 0"});
    	listIn.add(new String[] {"MEMBER", "WHERE (MEMBERREGIDATE BETWEEN SYSDATE-7 AND SYSDATE) AND ADMIN = 0"});
    	listIn.add(new String[] {"MEMBER", "WHERE ADMIN >= 1"});
    	listIn.add(new String[] {"MEMBER", "WHERE (MEMBERREGIDATE BETWEEN SYSDATE-7 AND SYSDATE) AND ADMIN >= 1"});
    	listIn.add(new String[] {"MEMBER", "WHERE ADMIN NOT IN (0, 1, 2)"});
    	listIn.add(new String[] {"MEMBER", "WHERE (MEMBERREGIDATE BETWEEN SYSDATE-7 AND SYSDATE) AND ADMIN NOT IN (0, 1, 2)"});

    	AdminDAO dao = new AdminDAO();
    	List<Integer> listOut = dao.AllMember(listIn);
    	
    	request.setAttribute("listOut", listOut);
    	
    	MemberDAO daoMem = new MemberDAO();
        List<MemberDTO> listAdmin = daoMem.getSelectAll(); 
        
        for(int i = 0; i < listAdmin.size(); i++) {
        	String memberImage = listAdmin.get(i).getMemberImage();
        	
        	if (memberImage == null || memberImage.equals("-")) {
        		listAdmin.get(i).setMemberImage("member_none.jpg");
        	} else {
        		String[] partsImage = listAdmin.get(i).getMemberImage().split("\\|");
        		if (partsImage.length > 1) {
        			listAdmin.get(i).setMemberImage(partsImage[1]);
        		} else {
        			listAdmin.get(i).setMemberImage(partsImage[0]);
        		}
        	}
        }
        
        request.setAttribute("listAdmin", listAdmin);

        request.getRequestDispatcher("/WEB-INF/page/admin/admin_member.jsp").forward(request, response);
    }
}