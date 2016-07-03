package com.ibm.cio.authenticate;
import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Vector;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.collections.CollectionUtils;
import com.ibm.bluepages.BPResults;
import com.ibm.bluepages.BluePages;
import com.ibm.json.java.JSONObject;
import com.ibm.swat.password.ReturnCode;
import com.ibm.swat.password.cwa2;
public class Bluepages implements AuthenticationFacade{
    private boolean isAuthenticated = false;
    private String adminGroupName = "";
    public Bluepages() {
    }

    public Bluepages(String adminGroupName){
        this.adminGroupName = adminGroupName;
    }
    public boolean authenticate(String email, String password) {
        System.out.println("Calling Bluepages.authenticate");
        if (isAuthenticated) {
            return isAuthenticated;
        }

        try {
            cwa2 cw = new cwa2("ldaps://bluepages.ibm.com:689", "ldaps://bluegroups.ibm.com:689");
            ReturnCode rc = cw.authenticate(email, password);
            int code = rc.getCode();
            System.out.println(rc.getMessage());
            System.out.println("code: " + code);
            if (code == 0) {
                isAuthenticated = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return isAuthenticated;
    }

    public String getUserRole(String userName) {
        cwa2 cw = new cwa2("bluepages.ibm.com", "bluegroups.ibm.com");
        ReturnCode rc = cw.inAGroup(userName, adminGroupName);
        if (rc.getCode() == 0) // not belong
            return UserRole.admin.name();
        else
            return UserRole.user.name();
    }
    @SuppressWarnings("unchecked")
    public String getFullName(String intranetId) {
        BPResults results = null;
        results = BluePages.getPersonsByInternet(intranetId);
        Vector<String> nameCols = results.getColumn("NAME");
        if (CollectionUtils.isEqualCollection(nameCols,
                CollectionUtils.EMPTY_COLLECTION))
            return "";
        String name = nameCols.elementAt(0);
        int endIdx = name.indexOf("*");
        if (endIdx != -1) {
            name = name.substring(0, endIdx);
        }
        String[] names = name.split("\\,");
        if (names.length >= 2) {
            name = names[1].substring(1, names[1].length()) + " " + names[0];
            return name;
        } else {
            name = name.replaceAll("\\,", "");
            return name;
        }
    }
    // get image by internet Id
    public String getImageOfPersonsByInternet(String intranetId, int size) {
        String ret = null;
        String urlImage = "http://images.tap.ibm.com:10002/image/" + intranetId
                + "?s=" + size;
        try {
            URL url = new URL(urlImage);
            HttpURLConnection httpURLConnection = (HttpURLConnection) url
                    .openConnection();
            InputStream is = httpURLConnection.getInputStream();
            if (is == null) {
                System.out.println("NULL");
                return null;
            }
            BufferedInputStream bis = null;
            ByteArrayOutputStream out = null;
            bis = new BufferedInputStream(is, 1024 * 8);
            out = new ByteArrayOutputStream();
            int len = 0;
            byte[] buffer = new byte[1024];
            while ((len = bis.read(buffer)) != -1) {
                out.write(buffer, 0, len);
            }
            out.close();
            bis.close();
            byte[] data = out.toByteArray();
            ret = new String(Base64.encodeBase64(data));
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return ret;
    }
    // check sametime available
    public static boolean isSametimeAvailable() {
        boolean ret = false;
        return ret;
    }
    public JSONObject getPersonsByInternet(String intranetId) {
        JSONObject jsonObject = new JSONObject();
        BPResults results = null;
        results = BluePages.getPersonsByInternet(intranetId);
        parserColBluepage(jsonObject, results, PersonInfo.CNUM.toString());
        parserColBluepage(jsonObject, results, PersonInfo.ADDITIONAL.toString());
        parserColBluepage(jsonObject, results, PersonInfo.BACKCC.toString());
        parserColBluepage(jsonObject, results, PersonInfo.BACKNUM.toString());
        parserColBluepage(jsonObject, results, PersonInfo.BLDG.toString());
        parserColBluepage(jsonObject, results, PersonInfo.C.toString());
        parserColBluepage(jsonObject, results, PersonInfo.CELLULAR.toString());
        parserColBluepage(jsonObject, results, PersonInfo.COMPANY.toString());
        parserColBluepage(jsonObject, results, PersonInfo.COUNTRY.toString());
        parserColBluepage(jsonObject, results, PersonInfo.DEPT.toString());
        parserColBluepage(jsonObject, results, PersonInfo.DIRECTORY.toString());
        parserColBluepage(jsonObject, results, PersonInfo.DIV.toString());
        parserColBluepage(jsonObject, results,
                PersonInfo.EMAILADDRESS.toString());
        parserColBluepage(jsonObject, results, PersonInfo.EMPCC.toString());
        parserColBluepage(jsonObject, results, PersonInfo.EMPCC.toString());
        parserColBluepage(jsonObject, results, PersonInfo.EMPNUM.toString());
        parserColBluepage(jsonObject, results, PersonInfo.EMPTYPE.toString());
        parserColBluepage(jsonObject, results, PersonInfo.FAX.toString());
        parserColBluepage(jsonObject, results, PersonInfo.FAXTIE.toString());
        parserColBluepage(jsonObject, results, PersonInfo.FLOOR.toString());
        parserColBluepage(jsonObject, results, PersonInfo.HRACTIVE.toString());
        parserColBluepage(jsonObject, results,
                PersonInfo.HRASSIGNMENT.toString());
        parserColBluepage(jsonObject, results, PersonInfo.HRASSIGNEE.toString());
        parserColBluepage(jsonObject, results,
                PersonInfo.HRCOMPANYCODE.toString());
        parserColBluepage(jsonObject, results,
                PersonInfo.HRCOUNTRYCODE.toString());
        parserColBluepage(jsonObject, results,
                PersonInfo.HRDEPARTMENT.toString());
        parserColBluepage(jsonObject, results, PersonInfo.HRDIVISION.toString());
        parserColBluepage(jsonObject, results,
                PersonInfo.HREMPLOYEETYPE.toString());
        parserColBluepage(jsonObject, results,
                PersonInfo.HRFAMILYNAME.toString());
        parserColBluepage(jsonObject, results,
                PersonInfo.HRFIRSTNAME.toString());
        parserColBluepage(jsonObject, results,
                PersonInfo.HRMANAGERINDICATOR.toString());
        parserColBluepage(jsonObject, results,
                PersonInfo.HRMANAGERPSC.toString());
        parserColBluepage(jsonObject, results,
                PersonInfo.HRMANAGERSERIAL.toString());
        parserColBluepage(jsonObject, results,
                PersonInfo.HRMIDDLENAME.toString());
        parserColBluepage(jsonObject, results,
                PersonInfo.HROTHERNAME.toString());
        parserColBluepage(jsonObject, results,
                PersonInfo.HRPREFERREDNAME.toString());
        parserColBluepage(jsonObject, results,
                PersonInfo.HRSERIALNUMBER.toString());
        parserColBluepage(jsonObject, results, PersonInfo.HRPSC.toString());
        return jsonObject;
    }
    @SuppressWarnings("unchecked")
    public static void parserColBluepage(JSONObject jsonObject,
            BPResults results, String colName) {
        Vector<String> nameCols = results.getColumn(colName);
        String name = null;
        if (!CollectionUtils.isEqualCollection(nameCols,
                CollectionUtils.EMPTY_COLLECTION)) {
            name = nameCols.elementAt(0);
            jsonObject.put(colName, name);
        }
    }

    public boolean logoff() {
        isAuthenticated = false;
        return isAuthenticated;
    }
    public JSONObject getSametimeInfoByIntranetId(String intranetId) {
        JSONObject jsonObject = null;
        String W4_SERVER = "http://w4.ibm.com/nova/services/bluepages/text/";// hieucao@us.ibm.com?sametime=true";
        String connectionURL = W4_SERVER + intranetId
                + "?sametime=true";
        BufferedReader inReader = null;
        try {
            URL s = new URL(connectionURL);
            // System.out.println("connect to "+connectionURL);
            HttpURLConnection con = (HttpURLConnection) s.openConnection();
            String line = null;
            InputStream is = con.getInputStream();
            if (is != null) {
                jsonObject = new JSONObject();
                inReader = new BufferedReader(new InputStreamReader(
                        con.getInputStream(), "ISO-8859-1"));
                while (null != (line = inReader.readLine())) {
                    parserColSametime(jsonObject, line);
                }
                inReader.close();
            }
        } catch (Exception e) {
            // System.out.println(e);
            e.printStackTrace();
        } finally {
            if (inReader != null) {
                try {
                    inReader.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return jsonObject;
    }
    private static void parserColSametime(JSONObject jsonObject, String line) {

        int i = line.indexOf('=');
        String key = line.substring(0, i - 1);
        String value = line.substring(i + 1, line.length());
        if (value != null && !value.trim().equals("")) {
            jsonObject.put(key, value);
        }
    }
    public boolean isAuthenticated() {
        return isAuthenticated;
    }
    public String getAdminGroupName() {
        return adminGroupName;
    }
    public void setAdminGroupName(String adminGroupName) {
        this.adminGroupName = adminGroupName;
    }
    public static void main(String[] agrs) {
        Bluepages bluepages = new Bluepages();
        if(bluepages.authenticate("chrisfel@ca.ibm.com", "****")){
            System.out.println("Authenticated!");
        }else{
            System.out.println("Failed to authenticate");
        }
//      getSametimeInfoByIntranetId();
//      int i = "additional = ".indexOf('=');
//      System.out.println("additional = ".substring(0, i-1));
        // System.out.println(getImageOfPersonsByInternet("siemdt@vn.ibm.com",
        // 60));
    }
}
