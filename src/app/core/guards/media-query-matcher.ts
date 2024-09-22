import {CanMatchFn, Route, UrlSegment} from "@angular/router";
import {inject} from "@angular/core";
import {MediaQueryService} from "../services/media-query.service";

export const mediaQueryMatcher: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  return inject(MediaQueryService).isHandset$;
};
