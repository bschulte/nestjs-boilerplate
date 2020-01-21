import { Request } from 'express';
import { User } from 'src/modules/user/user.entity';
import { AppSubmission } from 'src/modules/appSubmission/appSubmission.entity';

export type RequestWithUser = Request & { user: User };
export type MobilePlatform = 'android' | 'ios';
export type MdmType = 'airwatch' | 'maas360' | 'mobileiron';
export type PostProcessedSubmission = AppSubmission & {
  belongsToUser?: boolean;
  parsedIssues?: any[];
  signingAuth?: string | null;
};

export type AppSubmissionStatus = 0 | 1 | 2 | 50 | 55 | 80 | 81;
export type AppIssueStatus = 'default' | 'passed';
export type AppSubmissionReviewStatus = 'default' | 'passed';

export type AppResultsType =
  | 'html'
  | 'pdf'
  | 'json'
  | 'niap_html'
  | 'niap_pdf'
  | 'niap_json'
  | 'traffic'
  | 'taiwan'
  | 'network_pcap';

export type OrderDir = 'DESC' | 'ASC';
