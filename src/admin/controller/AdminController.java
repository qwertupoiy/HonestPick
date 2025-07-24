package admin.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import admin.Class.*;

@WebServlet("/Admin_servlet/*")
public class AdminController extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Map<String, AdminCommand> commandMap = new HashMap<>();

    @Override
    public void init() throws ServletException {
        commandMap.put("admin_home.do", new Admin_home());
        commandMap.put("admin_homeEdit.do", new Admin_homeEdit());
        commandMap.put("admin_ads.do", new Admin_ads());
        commandMap.put("admin_ads_view.do", new Admin_ads_view());
        commandMap.put("admin_ads_add.do", new Admin_ads_add());
        commandMap.put("admin_ads_addProc.do", new Admin_ads_addProc());
        commandMap.put("admin_ads_delete.do", new Admin_ads_delete());
        commandMap.put("admin_ads_edit.do", new Admin_ads_edit());
        commandMap.put("admin_ads_editProc.do", new Admin_ads_editProc());
        commandMap.put("admin_member.do", new Admin_member());
        commandMap.put("admin_stores.do", new Admin_stores());
        commandMap.put("storeAdd.do", new StoreAdd("show"));
        commandMap.put("storeAddProc.do", new StoreAdd("handle"));
        commandMap.put("storeEdit.do", new StoreEdit());
        commandMap.put("storeEditProc.do", new StoreEditProc());
        commandMap.put("storeRemove.do", new StoreRemove());
        commandMap.put("menuAdd.do", new MenuAdd());
        commandMap.put("menuAddProc.do", new MenuAddProc());
        commandMap.put("menuEdit.do", new MenuEdit());
        commandMap.put("menuEditProc.do", new MenuEditProc());
        commandMap.put("menuRemove.do", new MenuRemove());
        commandMap.put("reviewAdd.do", new ReviewAdd());
        commandMap.put("reviewAddProc.do", new ReviewAddProc());
        commandMap.put("reviewEdit.do", new ReviewEdit());
        commandMap.put("reviewEditProc.do", new ReviewEditProc());
        commandMap.put("reviewRemove.do", new ReviewRemove());
        commandMap.put("inquiryEdit.do", new InquiryEdit());
        commandMap.put("inquiryEditProc.do", new InquiryEditProc());
        commandMap.put("inquiryRemove.do", new InquiryRemove());
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        String path = request.getContextPath();
        String url = request.getRequestURL().toString();
        String action = extractAction(url);

        request.setAttribute("path", path);

        AdminCommand command = commandMap.get(action);
        if (command != null) {
            command.execute(request, response, path);
        } else {
            System.out.println("== Admin Controller Contains None ==");
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    private String extractAction(String url) {
        int idx = url.lastIndexOf("/");
        return idx >= 0 ? url.substring(idx + 1) : "";
    }
}
